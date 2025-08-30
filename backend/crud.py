from sqlalchemy.orm import Session
from . import models, schemas


def create_poll(db: Session, poll: schemas.PollCreate):

    poll_model = models.Poll(title=poll.title, created_by=poll.created_by)

    db.add(poll_model)
    db.flush()

    db.commit()
    db.refresh(poll_model)
    return poll_model

def create_question(db: Session, question: schemas.QuestionCreate):

    question_model = models.Question(poll_id=question.poll_id, text=question.text)  
    db.add(question_model)
    db.commit()
    db.refresh(question_model)

    return question_model

def get_poll(db: Session, poll_id: int):

    return db.query(models.Poll).filter(models.Poll.id == poll_id).first()


def get_polls(db: Session, skip: int = 0, limit: int = 10):

    return db.query(models.Poll).offset(skip).limit(limit).all()

def get_polls_by_user(db: Session, created_by: str):
    return db.query(models.Poll).filter(models.Poll.created_by == created_by).all()

def create_answer(db: Session, answer: schemas.AnswerCreate):

    answer_model = models.Answer(**answer.model_dump())  # ???
    db.add(answer_model)
    db.commit()
    db.refresh(answer_model)

    return answer_model


def get_answers_for_poll(db: Session, poll_id: int):

    return (
        db.query(models.Answer)
        .join(models.Question)
        .filter(models.Question.poll_id == poll_id)
        .all()
    )


def create_user(db: Session, user: schemas.UserCreate):

    user_model = models.User(username=user.username, password=user.password)
    db.add(user_model)
    db.commit()
    db.refresh(user_model)

    return user_model


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def verify_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if user and user.password == password:
        return user
    return None

def get_questions_for_poll(db: Session, poll_id: int):
    return db.query(models.Question).filter(models.Question.poll_id == poll_id).all()