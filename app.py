from fastapi import FastAPI
from vercel_fastapi import VercelFastAPI

app = FastAPI()

@app.get("/")
def read_root():
	return {"message": "Hello from Vercel FastAPI!"}

handler = VercelFastAPI(app)
