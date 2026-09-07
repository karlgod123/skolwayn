from fastapi import FastAPI, HTTPException
import uvicorn
from pydantic import BaseModel, EmailStr, Field, ConfigDict

app = FastAPI()

dataBase = []

@app.get('/basedata',
         tags=['База данных'],
         summary='Получить всех пользователей'
         )
def show_data():
    return dataBase

@app.get('/correct_data{index}',
         tags=['База данных'],
         summary='Получить конкретного пользователя по индексу')
def show_correct_data(index: int):
    try:
        return dataBase[index]
    except:
        raise HTTPException(status_code=404, detail='Пользователь не найден')

class NewUser(BaseModel):
    username: str = Field(
        min_length=1,
        max_length=15,
        pattern= r'^[a-zA-Z0-9_а-яА-Я]+$'#r'^[a-zA-Z0-9_]+$'#Только латиница, цифры, _
    )
    mail: EmailStr
    password: str = Field(min_length=6)
    model_config = ConfigDict(extra='forbid')

@app.post("/add_user")
def add_user(new_user: NewUser):
    if any(u['username'] == new_user.username for u in dataBase):
        raise HTTPException(400, "Данный пользователь уже зарегестрирован!")

    if any(u['mail'] == new_user.mail for u in dataBase):
        raise HTTPException(400, "Данная почта уже используется другим пользователем!")

    user_data = {
        'id': len(dataBase) + 1,
        'username': new_user.username,
        'mail': new_user.mail,
        'password': new_user.password
    }
    dataBase.append(user_data)
    return {'success': True, "message": 'Пользователь успешно добавлен!'}
    #raise HTTPException(status_code=400 , detail='Убедитесь в правильности введенных данных')


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)