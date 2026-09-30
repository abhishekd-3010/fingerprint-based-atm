# 🔐 Fingerprint-Based ATM System

> An IoT-enabled ATM system combining biometric authentication, ESP32 hardware, Firebase Realtime Database, and a React-based user interface.

## 📌 Overview

The Fingerprint-Based ATM System is a smart ATM prototype designed to provide secure and convenient banking transactions using **fingerprint authentication** instead of relying only on traditional card-based authentication.

The system integrates an **ESP32 microcontroller** with an **R307 fingerprint sensor** and **Firebase Realtime Database** to communicate authentication and transaction information with a web-based React interface.

Users can authenticate using a fingerprint or card credentials and perform basic banking operations such as checking balance, depositing funds, withdrawing funds, and viewing transaction history.

---

## ✨ Key Features

- 🔐 **Fingerprint Authentication** – User verification using the R307 fingerprint sensor.
- 💳 **Card-Based Login** – Alternative authentication using card ID and PIN.
- 💰 **Balance Inquiry** – View the current account balance.
- ➕ **Deposit** – Add funds to the user's account.
- ➖ **Withdrawal** – Withdraw funds after authentication.
- 📋 **Transaction History** – View previous banking transactions.
- ☁️ **Real-Time Database** – Firebase Realtime Database for communication between hardware and web application.
- ⚡ **ESP32 Integration** – Microcontroller-based hardware control and communication.
- 🌐 **React Web Interface** – Web-based interface for ATM operations.
- 🔔 **Hardware Feedback** – LED and buzzer feedback for authentication and transaction events.

---

## 🛠️ Tech Stack

### 💻 Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### 🔌 Hardware & Embedded
- ESP32 WROOM
- R307 Fingerprint Sensor
- LED
- Buzzer
- Breadboard

### ☁️ Backend / Cloud
- Firebase Realtime Database
- Firebase Authentication

### 🔧 Development Tools
- Arduino IDE
- Git
- GitHub

---

## 🏗️ System Architecture

```text
                  👤 User
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
   🖐️ Fingerprint         💳 Card + PIN
      R307 Sensor             │
          │                   │
          └─────────┬─────────┘
                    ▼
               🔌 ESP32
                    │
                    ▼
          ☁️ Firebase Realtime
              Database
                    │
                    ▼
             ⚛️ React UI
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Balance   Deposit   Withdrawal
                              │
                              ▼
                     📋 Transaction History
