from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(String, nullable=False)
    title = Column(String, nullable=False)

    questions = relationship(
        "Question", back_populates="poll", cascade="all, delete-orphan"
    )
    ai_insights = relationship(
        "AIPollInsights", back_populates="poll", cascade="all, delete-orphan"
        )

class AIPollInsights(Base):
    __tablename__ = "ai_poll_insights"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"))
    positive_feedback = Column(Text, nullable=False)
    negative_feedback = Column(Text, nullable=False)
    suggestions_for_improvement = Column(Text, nullable=False)

    poll = relationship("Poll", back_populates="ai_insights")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"))
    text = Column(Text, nullable=False)

    poll = relationship("Poll", back_populates="questions")
    answers = relationship(
        "Answer", back_populates="question", cascade="all, delete-orphan"
    )


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    text = Column(Text, nullable=False)
    responder_id = Column(Integer, index=True)

    question = relationship("Question", back_populates="answers")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

