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
import torch

app = FastAPI(title="AI Poll Insights API", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # или ["*"] для всех
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


class SummaryParser(BaseOutputParser):
    def parse(self, text: str) -> dict:

        sections = text.split("\n")
        return {
            "Positive Feedback": sections[-3]
            .replace("Positive Feedback: ", "")
            .strip(),
            "Negative Feedback": sections[-2]
            .replace("Negative Feedback: ", "")
            .strip(),
            "Suggestions for Improvement": sections[-1]
            .replace("Suggestions for Improvement: ", "")
            .strip(),
        }

class AnswerList(BaseModel):
    answers: List[schemas.AnswerCreate]

class PollQuestion(BaseModel):
    question: str
    answers: list[str]


print("Loading model...")
print("Is GPU available? " + "Yes" if torch.cuda.is_available() else "No")
print("GPU name: " + torch.cuda.get_device_name(0))

summarization_model = pipeline(
    "text-generation",
    model="mistralai/Mistral-7B-Instruct-v0.2",
    torch_dtype="auto",
    device=0,
)

sentiment_model = pipeline("sentiment-analysis", device=0)

llm = HuggingFacePipeline(pipeline=summarization_model)

template = PromptTemplate.from_template(
    """Summarize the following poll answers with provided question: {poll_answers}.
    Respond in exactly three lines, each starting with the section name followed by the summary on the same line.
    Format the response as follows:
        "Positive Feedback": <1-2 sentences combining all strengths into a concise summary.>
        "Negative Feedback": <1-2 sentences combining all criticisms into a concise summary.>
        "Suggestions for Improvement": <1-2 sentences summarizing common recommendations.>
    Do not list multiple points separately — merge them into flowing sentences. Do not exceed two sentences per section.
    Do not include any additional text or explanations.
    Do not add additionial newlines or formatting.
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


@app.get("/summarize/{poll_id}")
async def summarize_poll_answers():

    result = chain.invoke({"poll_answers": test_poll_answers})
    return result


@app.post("/summarize")
async def summarize_poll_answers_post(body: list[PollQuestion]):

    positive_answers_amount = 0

    poll_answers = []
    answer_count = 0

    for index in body:

        question, answers = index.question, index.answers

        print(f"Processing question: {question}")
        print(f"Answers: {answers}")

        for answer in answers:
            sentiment = sentiment_model(answer)[0]
            if sentiment["label"] == "POSITIVE":
                positive_answers_amount += 1
            answer_count += 1

        poll_answers.append(f"{question}: {"\n".join(answers)}")

    result = chain.invoke({"poll_answers": poll_answers})
    result["Positive Answer Percentage"] = (
        f"{(positive_answers_amount / answer_count) * 100:.2f}%"
    )
    result["Negative Answer Percentage"] = (
        f"{((answer_count - positive_answers_amount) / answer_count) * 100:.2f}%"
    )
    result["Total Answers"] = answer_count

    return result


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
    return crud.get_polls_by_user(db=db, creator_id=creator_id)

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
    print("Received answers:", answers)
    created_answers = []
    for answer in answers.answers:
        created_answer = crud.create_answer(db=db, answer=answer)
        created_answers.append(created_answer)
    return created_answers