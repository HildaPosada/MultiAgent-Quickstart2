import streamlit as st
import requests

st.title("MultiAgent Quickstart2 - Backend Connection Demo")

# Replace with your actual backend URL
BACKEND_URL = "https://multi-agent-quickstart2-duyi.vercel.app/"  # Public Vercel backend URL

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
