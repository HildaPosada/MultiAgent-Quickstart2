import streamlit as st
import requests

st.title("MultiAgent Quickstart2 - Backend Connection Demo")

# Replace with your actual backend URL
BACKEND_URL = "http://localhost:8000/"  # Change to public URL if available

st.write("Fetching data from FastAPI backend...")

try:
	response = requests.get(BACKEND_URL)
	if response.status_code == 200:
		st.success("Backend response:")
		st.write(response.text)
	else:
		st.error(f"Backend returned status code {response.status_code}")
except Exception as e:
	st.error(f"Could not connect to backend: {e}")
