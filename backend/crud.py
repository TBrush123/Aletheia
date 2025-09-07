from sqlalchemy.orm import Session
from . import models, schemas


def create_poll(db: Session, poll: schemas.PollCreate):

    poll_model = models.Poll(title=poll.title, creator_id=poll.creator_id)

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

    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()

    if poll:
        user = db.query(models.User).filter(models.User.id == poll.creator_id).first()
        if user:
            setattr(poll, "created_by", user.username)

    return poll 

def get_poll_response_count(db: Session, poll_id: int):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        return None

    response_count = db.query(models.Response).filter(models.Response.poll_id == poll_id).count()
    question_count = db.query(models.Question).filter(models.Question.poll_id == poll_id).count()

    result = {}
    
    result["responseCount"] = response_count
    result["questionCount"] = question_count

    return result

def get_polls(db: Session, skip: int = 0, limit: int = 10):

    return db.query(models.Poll).offset(skip).limit(limit).all()


def get_polls_by_user(db: Session, creator_id: int):
    return db.query(models.Poll).filter(models.Poll.creator_id == creator_id).all()

def create_answer(db: Session, answer: schemas.AnswerCreate):

    answer_model = models.Answer(question_id=answer.question_id, text=answer.text, response_id=answer.response_id)
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

def create_response(db: Session, response: schemas.ResponseCreate):
    print('Creating response:', response)
    response_model = models.Response(responder_id=response.responder_id, poll_id=response.poll_id)
    db.add(response_model)
    db.commit()
    db.refresh(response_model )

    return response_model
