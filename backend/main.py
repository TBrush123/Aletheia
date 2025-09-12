from fastapi import FastAPI, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from transformers import pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.schema import BaseOutputParser
from sqlalchemy.orm import Session
from . import models, schemas, crud, database
from .database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
import json
import torch
import re

app = FastAPI(title="AI Poll Insights API", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


import re
import json
from typing import List
from langchain.schema import BaseOutputParser

class SummaryParser(BaseOutputParser):
    def parse(self, text: str) -> dict:
        print("Raw model output:", text)

        text = re.split(r'\[\[Prototype\]\].*$', text, flags=re.DOTALL)[0].strip()
        objects = self._find_top_level_braced_objects(text)
        if objects:
            candidate = objects[-1]
        else:
            candidate = text

        for fn in (self._try_json_load, self._try_cleanup_and_load, self._try_section_regex):
            try:
                parsed = fn(candidate, full_text=text)
                return {
                    "Positive Feedback": parsed.get("Positive Feedback", "").strip(),
                    "Negative Feedback": parsed.get("Negative Feedback", "").strip(),
                    "Suggestions for Improvement": parsed.get("Suggestions for Improvement", "").strip(),
                }
            except Exception as e:
                last_err = e

        raise ValueError(f"Unable to parse output. Last error: {last_err}\nRaw text: {text}")

    def _find_top_level_braced_objects(self, s: str) -> List[str]:
        objs = []
        stack = 0
        start = None
        for i, ch in enumerate(s):
            if ch == '{':
                if stack == 0:
                    start = i
                stack += 1
            elif ch == '}':
                stack -= 1
                if stack == 0 and start is not None:
                    objs.append(s[start:i+1])
                    start = None
        return objs

    def _try_json_load(self, s: str, **_) -> dict:
        return json.loads(s)

    def _try_cleanup_and_load(self, s: str, **_) -> dict:
        cleaned = s
        cleaned = cleaned.replace('“', '"').replace('”', '"').replace('’', "'").replace('‘', "'")
        cleaned = re.sub(r'BEGIN_JSON', '', cleaned)
        cleaned = re.sub(r'END_JSON', '', cleaned)
        cleaned = re.sub(r',\s*([}\]])', r'\1', cleaned)
        cleaned = re.sub(r'(?<=\{|,)\s*([A-Za-z0-9 _\-]+)\s*:', r'"\1":', cleaned)
        cleaned = re.sub(r':\s*\'([^\']*)\'', r': "\1"', cleaned)
        return json.loads(cleaned)

    def _try_section_regex(self, s: str, full_text: str = None) -> dict:
        text = full_text if full_text is not None else s

        def extract_between(key, text, next_keys):
            nk = '|'.join(re.escape(k) for k in next_keys)
            pattern = rf'{re.escape(key)}\s*[:\n]\s*(["\']?)(.*?)\1\s*(?=(?:{nk})\s*[:\n]|$)'
            m = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if m:
                return m.group(2).strip()
            m2 = re.search(rf'"{re.escape(key)}"\s*:\s*"(.*?)"', text, re.DOTALL | re.IGNORECASE)
            if m2:
                return m2.group(1).strip()
            return ""

        keys = ["Positive Feedback", "Negative Feedback", "Suggestions for Improvement"]
        pf = extract_between(keys[0], text, keys[1:])
        nf = extract_between(keys[1], text, [keys[2]])
        sf = extract_between(keys[2], text, [])

        return {
            "Positive Feedback": pf,
            "Negative Feedback": nf,
            "Suggestions for Improvement": sf,
        }

class AnswerList(BaseModel):
    answers: List[schemas.AnswerCreate]

class PollQuestion(BaseModel):
    question: str
    answers: list[str]


print("Loading model...")

if torch.cuda.is_available():
    device = 0
    print("Is GPU available? Yes")
    print("GPU name:", torch.cuda.get_device_name(0))
else:
    device = -1
    print("Is GPU available? No")
    print("Running on CPU")

summarization_model = pipeline(
    "text-generation",
    model="mistralai/Mistral-7B-Instruct-v0.2",
    torch_dtype="auto",
    device=device,
)


llm = HuggingFacePipeline(pipeline=summarization_model)

template = PromptTemplate.from_template(
    """Summarize the following poll answers: {poll_answers}

Extract feedback and organize it into exactly 3 categories: Positive Feedback, Negative Feedback, and Suggestions for Improvement. Each should be a JSON array of sentences.
Return EXACTLY one JSON object between the markers BEGIN_JSON and END_JSON and nothing else.

BEGIN_JSON
{{
  "Positive Feedback": "<1-2 sentence summary or empty string>",
  "Negative Feedback": "<1-2 sentence summary or empty string>",
  "Suggestions for Improvement": "<1-2 sentence summary or empty string>"
}}
END_JSON

Rules:
- Return only the JSON between BEGIN_JSON and END_JSON.
- Use double quotes for keys and string values; produce valid JSON.
- If a field has no content, set it to an empty string "".
- Do not echo the example, do not add extra text or commentary.
- 
"""
)


chain = template | llm | SummaryParser()

test_poll_answers = [
    {
        "question": "What did you think about the movie’s story?",
        "answers": [
            "The story was captivating and kept me engaged throughout.",
            "I found the plot to be predictable and lacking depth.",
            "The storyline was unique and refreshing, I loved it!",
            "It was a bit confusing at times, but overall enjoyable.",
        ],
    },
    {
        "question": "How did you feel about the acting performances?",
        "answers": [
            "The actors delivered outstanding performances, especially the lead.",
            "Some performances felt overacted and unrealistic.",
            "I thought the supporting cast was excellent, adding depth to the film.",
        ],
    },
]

def create_ai_summary(db, poll_id):
    poll_questions = crud.get_questions_for_poll(db=db, poll_id=poll_id)
    poll_responses = {}

    poll_formated_responses = []

    for question in poll_questions:
        answers = crud.get_answers_for_question(db=db, question_id=question.id)
        poll_responses[question.text] = [answer.text for answer in answers]

    print(poll_responses)


    for question, answers in poll_responses.items():

        poll_formated_responses.append(f"question: {question} answers: {', '.join(answers)}")


    result = chain.invoke({"poll_answers": poll_formated_responses})
    

    return result



@app.get("/summarize/{poll_id}")
async def summarize_poll_answers(db, poll_id):

    result = chain.invoke({"poll_answers": test_poll_answers})

    return result
    



@app.get("/poll/{poll_id}/summary", response_model=schemas.AIResponseOut)
async def summarize_poll_answers_post(poll_id: int, db: Session = Depends(get_db)):

    summary = crud.get_ai_summary_from_db(db=db, poll_id=poll_id)

    if summary:
        return summary

    ai_response = create_ai_summary(db=db, poll_id=poll_id)

    result = schemas.AIResponseCreate(poll_id=poll_id, positive_feedback=ai_response["Positive Feedback"], negative_feedback=ai_response["Negative Feedback"], suggestions_for_improvement=ai_response["Suggestions for Improvement"])

    ai_model = crud.save_ai_summary(db=db, ai_response=result, poll_id=poll_id)

    return ai_model

@app.get("/poll/{poll_id}/summary/delete")
async def summarize_poll_answers_post(poll_id: int, db: Session = Depends(get_db)):
    crud.delete_ai_summary_from_db(db=db, poll_id=poll_id)

@app.get("/polls/{poll_id}", response_model=schemas.PollOut)
def get_poll(poll_id: int, db: Session = Depends(get_db)):
    poll = crud.get_poll(db=db, poll_id=poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return poll


@app.post("/responses", response_model=schemas.AnswerOut)
def create_answer(answer: schemas.AnswerCreate, db: Session = Depends(get_db)):
    return crud.create_answer(db=db, answer=answer)


@app.get("/polls/{poll_id}/responses", response_model=List[schemas.PollOut])
def get_answers_for_poll(poll_id: int, db: Session = Depends(get_db)):
    return crud.get_answers_for_poll(db=db, poll_id=poll_id)


@app.post("/users", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db=db, username=user.username)
    if not user or not crud.verify_user(db, user.username, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"username": user.username, "password": user.password, "message": "Login successful", "user_id": user.id}

@app.post("/auth/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db=db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return crud.create_user(db=db, user=user)

@app.get("/polls", response_model=List[schemas.PollOut])
def get_polls(creator_id: int, db: Session = Depends(get_db)):
    polls = crud.get_polls_by_user(db=db, creator_id=creator_id)

    for poll in polls:
        response_count = crud.get_poll_response_count(db=db, poll_id=poll.id)
        setattr(poll, "response_count", response_count["responseCount"])
        setattr(poll, "question_count", response_count["questionCount"])
    
    return polls


@app.post("/polls", response_model=schemas.PollOut)
def create_poll(poll: schemas.PollCreate, db: Session = Depends(get_db)):
    return crud.create_poll(db=db, poll=poll)

@app.post("/questions", response_model=schemas.QuestionOut)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db=db, question=question)

@app.get("/questions/{poll_id}", response_model=List[schemas.QuestionOut])
def get_questions_for_poll(poll_id: int, db: Session = Depends(get_db)):
    return crud.get_questions_for_poll(db=db, poll_id=poll_id)

@app.post("/answers")
def submit_answers(answers: AnswerList, db: Session = Depends(get_db)):
    created_answers = []
    for answer in answers.answers:
        created_answer = crud.create_answer(db=db, answer=answer)
        created_answers.append(created_answer)
    return created_answers

@app.post("/response", response_model=schemas.ResponseOut)
def create_poll_response(response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    return crud.create_response(db=db, response=response)
   
@app.get("/response", response_model=List[schemas.ResponseOut])
def get_all_responses(responder_id: int, db: Session = Depends(get_db)):
    return crud.get_all_responses(db=db, responder_id=responder_id)

@app.delete("/users/delete")
def delete_account(user_id: int, db: Session = Depends(get_db)):
    crud.delete_account(db=db, user_id=user_id)