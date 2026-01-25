# 🧬 AMR-Atlas — Antibiotic Resistance Awareness & Risk Dashboard

AMR-Atlas is a **web application** designed to **visualize, explain, and raise awareness** about **Antimicrobial Resistance (AMR)**.  
The project demonstrates how **human behavior, antibiotic exposure, and selective pressure** contribute to the growing global AMR crisis.

This is an **educational and analytical dashboard**, not a diagnostic or medical decision tool.

Project link: https://amr-atlas.vercel.app/

---

## 📌 Problem Statement

Antimicrobial Resistance (AMR) occurs when bacteria evolve to survive antibiotic exposure, making infections harder to treat.  
A major cause of AMR is **misuse and overuse of antibiotics**, combined with **incomplete treatment courses** and **environmental exposure pathways**.

There is a lack of **interactive, easy-to-understand platforms** that explain:
- How resistance develops
- Why stopping antibiotics early is dangerous
- How individual behavior contributes to long-term risk

---

## 🎯 Project Objectives

- Educate users on **how antibiotic resistance develops**
- Visualize **selective pressure and exposure pathways**
- Demonstrate **risk awareness**, not medical prediction
- Build a **real-world full-stack application** with proper deployment

---

## 🧩 System Architecture

The project follows a **decoupled frontend–backend architecture**:

### 🔹 Frontend
- Built using **React + Vite**
- Handles UI, visualizations, and user interaction
- Deployed on **Vercel**

### 🔹 Backend
- Built using **Flask (Python)**
- Exposes REST APIs for datasets and analysis
- Deployed on **Railway**

### 🔹 Communication
- Frontend and backend communicate via **REST APIs**
- Backend URL is injected using **environment variables**
- CORS enabled for cross-origin access

---

## 🚀 Features

### 📊 Dataset Explorer
- Displays antibiotic resistance–related datasets
- Country-wise and category-wise views

### 🧪 Risk Lab
- Explores how resistance patterns vary
- Helps users understand **risk indicators**, not predictions

### ⚙️ Selective Pressure
- Demonstrates how antibiotic exposure eliminates susceptible bacteria
- Shows survival and multiplication of resistant strains

### 🌍 Exposure Pathways
- Visualizes how resistance spreads via:
  - Human misuse
  - Healthcare settings
  - Environmental contamination

### 📚 Knowledge & Awareness
- Step-by-step explanation of:
  - Antibiotic action
  - Resistance survival
  - Consequences of early discontinuation
- Designed for **non-technical users**

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- TypeScript
- CSS / SVG animations

### Backend
- Python
- Flask
- Flask-CORS
- Pandas / NumPy (data handling)

### Deployment
- Frontend: **Vercel**
- Backend: **Railway**

---

## 🌐 Live Deployment

### 🔗 Frontend (Public)
https://amr-atlas.vercel.app

### 🔗 Backend (API)
Deployed on Railway (secured via environment variables)


---

## ⚠️ Ethical Disclaimer

This project is **strictly educational**.

- It does **not** provide medical advice
- It does **not** diagnose or predict diseases
- All outputs are **illustrative and awareness-based**

Users are encouraged to consult qualified medical professionals for health decisions.

---

## 🧠 Key Learnings

- Real-world full-stack deployment
- Handling SPA routing issues in production
- Environment-based configuration
- Decoupled frontend–backend design
- Ethical handling of healthcare-related data

---

## 🔮 Future Enhancements

- User authentication for personalized dashboards
- More interactive simulations
- Expanded datasets and visual analytics
- Offline awareness modules for education

---

## 👩‍💻 Author

**Shalini Kannan**  
B.E. Computer Science & Engineering  
Project: AMR-Atlas  

---

## 📄 License

This project is developed for **academic and educational purposes**.
