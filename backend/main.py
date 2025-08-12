from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.schema import BaseOutputParser
import torch

app = FastAPI()

class SummaryParser(BaseOutputParser):
    def parse(self, text: str) -> dict:

        sections = text.split("\n")
        return {
            "Positive Feedback": sections[-3].replace("Positive Feedback: ", "").strip(),
            "Negative Feedback": sections[-2].replace("Negative Feedback: ", "").strip(),
            "Suggestions for Improvement": sections[-1].replace("Suggestions for Improvement: ", "").strip(),
        }

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

llm = HuggingFacePipeline(
    pipeline=summarization_model
    )

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
    """)

chain = template | llm | SummaryParser()

test_poll_answers = [
    {"question" : "What did you think about the movie’s story?",
     "answers": [
        "The story was captivating and kept me engaged throughout.",
        "I found the plot to be predictable and lacking depth.",
        "The storyline was unique and refreshing, I loved it!",
        "It was a bit confusing at times, but overall enjoyable."
    ]},
    {"question" : "How did you feel about the acting performances?",
     "answers": [
        "The actors delivered outstanding performances, especially the lead.",
        "Some performances felt overacted and unrealistic.",
        "I thought the supporting cast was excellent, adding depth to the film."
    ]}
]

@app.get("/summarize")
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
            if sentiment['label'] == 'POSITIVE':
                positive_answers_amount += 1
            answer_count += 1
            
        poll_answers.append(f"{question}: {"\n".join(answers)}")

    result = chain.invoke({"poll_answers": poll_answers})
    result["Positive Answer Percentage"] = f"{(positive_answers_amount / answer_count) * 100:.2f}%"
    result["Negative Answer Percentage"] = f"{((answer_count - positive_answers_amount) / answer_count) * 100:.2f}%"

    return result