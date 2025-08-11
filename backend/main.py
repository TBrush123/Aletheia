from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.schema import BaseOutputParser
import torch

class SummaryParser(BaseOutputParser):
    def parse(self, text: str) -> dict:
        print("Parsing response...")
        print("Response text:", text)
        sections = text.split("\n")
        print("\n\n")
        print("Sections found:", sections)
        print("\n\n")
        return {
            "Positive Feedback": sections[-3].replace("Positive Feedback: ", "").strip(),
            "Negative Feedback": sections[-2].replace("Negative Feedback: ", "").strip(),
            "Suggestions for Improvement": sections[-1].replace("Suggestions for Improvement: ", "").strip(),
        }

print("Loading model...")
print("Is GPU available? " + "Yes" if torch.cuda.is_available() else "No")
print("GPU name: " + torch.cuda.get_device_name(0))

summarization_model = pipeline(
    "text-generation",
    model="mistralai/Mistral-7B-Instruct-v0.2",
    torch_dtype="auto",
    device=0,
)   

llm = HuggingFacePipeline(
    pipeline=summarization_model
    )

template = PromptTemplate.from_template(
    """Summarize the following poll answers: {poll_answers}.
    Respond in exactly three lines, each starting with the section name followed by the summary on the same line.
    Format the response as follows:
        "Positive Feedback": <1–2 sentences combining all strengths into a concise summary.>
        "Negative Feedback": <1–2 sentences combining all criticisms into a concise summary.>
        "Suggestions for Improvement": <1–2 sentences summarizing common recommendations.>
    Do not list multiple points separately — merge them into flowing sentences. Do not exceed two sentences per section.
    Do not include any additional text or explanations.
    Do not add additionial newlines or formatting.
    """)

chain = template | llm | SummaryParser()

test_poll_answers = """
    "Incredibly immersive — the worldbuilding and atmosphere kept me hooked for hours."
    "Smooth gameplay with satisfying mechanics; controls feel very responsive."
    "The story was engaging, with unexpected twists that kept me guessing."
    "Graphics and sound design were top-notch — a real treat for the senses."
    "Lots of replay value thanks to multiple endings and hidden content."
    "Gameplay became repetitive after the first few hours."
    "Balance issues — some enemies felt unfairly difficult."
    "The controls were clunky, especially during combat sequences."
    "The story had potential but felt rushed and underdeveloped."
    "Too many bugs and glitches, which ruined the immersion."
"""

response = chain.invoke({"poll_answers": test_poll_answers})

print("Response:", response)