<div align="center">
<h1>
   <img src="https://img.icons8.com/pulsar-color/96/markdown.png" width="100" height="100" />
   <br>
   LOCAVQG-DEMO-SYSTEM-CABIN-AI
</h1>
<h3>◦ LocaVQG: AI-Powered Cabin Speech Recognition</h3>
<h3>◦ Developed with the software and tools below.</h3>

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" alt="YAML">
<img src="https://img.shields.io/badge/Webpack-8DD6F9.svg?style=flat&logo=Webpack&logoColor=black" alt="Webpack">
<img src="https://img.shields.io/badge/PowerShell-5391FE.svg?style=flat&logo=PowerShell&logoColor=white" alt="PowerShell">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">

<img src="https://img.shields.io/badge/OpenAI-412991.svg?style=flat&logo=OpenAI&logoColor=white" alt="OpenAI">
<img src="https://img.shields.io/badge/Python-3776AB.svg?style=flat&logo=Python&logoColor=white" alt="Python">
<img src="https://img.shields.io/badge/GitHub-181717.svg?style=flat&logo=GitHub&logoColor=white" alt="GitHub">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Flask-000000.svg?style=flat&logo=Flask&logoColor=white" alt="Flask">
<img src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" alt="Markdown">
</p>

![license](https://img.shields.io/github/license/kennysuper007/LocaVQG-Demo-System-Cabin-AI?style=flat&labelColor=E5E4E2&color=869BB3)
![repo-language-count](https://img.shields.io/github/languages/count/kennysuper007/LocaVQG-Demo-System-Cabin-AI?style=flat&labelColor=E5E4E2&color=869BB3)
![repo-top-language](https://img.shields.io/github/languages/top/kennysuper007/LocaVQG-Demo-System-Cabin-AI?style=flat&labelColor=E5E4E2&color=869BB3)
![last-commit](https://img.shields.io/github/last-commit/kennysuper007/LocaVQG-Demo-System-Cabin-AI?style=flat&labelColor=E5E4E2&color=869BB3)
</div>

---

## 🔗 Quick Links
- [🔗 Quick Links](#-quick-links)
- [📍 Overview](#-overview)
- [📂 Repository Structure](#-repository-structure)
- [🧩 Modules](#-modules)
- [🚀 Getting Started](#-getting-started)
  - [⚙️ Installation](#️-installation)
  - [🤖 Running LocaVQG-Demo-System-Cabin-AI](#-running-locavqg-demo-system-cabin-ai)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📍 Overview

The LocaVQG-Demo-System-Cabin-AI project is a cabin voice-controlled system that utilizes AI technologies. It aims to provide a seamless and intuitive experience for users to interact with their cabin environment using voice commands. By leveraging technologies such as openAI, Azure Cognitive Services, and Flask, this project enables users to control various aspects of their cabin, including transcribing voice input, querying information, and activating cabin functionalities through speech recognition. With its user-friendly interface and advanced AI capabilities, the LocaVQG-Demo-System-Cabin-AI project empowers users to effortlessly interact with their cabin, enhancing convenience and comfort.

---

## 📂 Repository Structure

```sh
└── LocaVQG-Demo-System-Cabin-AI/
    ├── GenerateAudio.py
    ├── HHweb/
    │   ├── bin/
    │   │   ├── Activate.ps1
    │   │   ├── activate
    │   │   ├── activate.csh
    │   │   ├── activate.fish
    │   │   ├── easy_install
    │   │   ├── easy_install-3.8
    │   │   ├── find-corrupt-whisper-files.py
    │   │   ├── flask
    │   │   ├── normalizer
    │   │   ├── openai
    │   │   ├── pip
    │   │   ├── pip3
    │   │   ├── pip3.8
    │   │   └── python
    ├── app.py
    ├── azure_TTS.py
    ├── chat_inference_package.py
    ├── chatgpt.py
    ├── example.txt
    ├── message.py
    ├── ofa_object_detection.txt
    ├── package-lock.json
    ├── package.json
    ├── prompt_templates.py
    ├── requirements.txt
    ├── synthesize.py
    ├── templates/
    │   └── index.html
    ├── test.py
    ├── testtest.js
    ├── textToSpeech.py
    ├── timeNote
    ├── webpack.config.js
    └── whisperTranscribe.py

```

---

## 🧩 Modules

<details closed><summary>.</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---                                                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [requirements.txt](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/requirements.txt)                   | The code snippet `GenerateAudio.py` is a critical feature in the LocaVQG-Demo-System-Cabin-AI repository. It generates audio using various dependencies and software mentioned in the `requirements.txt` file. The code allows for the synthesis of audio files based on input prompts.                                                                                                                                                                                                                                                                                                                             |
| [whisperTranscribe.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/whisperTranscribe.py)           | The `whisperTranscribe.py` file in the `LocaVQG-Demo-System-Cabin-AI` repository utilizes the OpenAI API to transcribe audio input and generate text output. It relies on the `openai` library and an API key stored in a YAML file.                                                                                                                                                                                                                                                                                                                                                                                |
| [GenerateAudio.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/GenerateAudio.py)                   | The code snippet in GenerateAudio.py uses the Azure Text-to-Speech API to generate audio files based on certain input messages. It loops through a list of messages, retrieves the content, and generates audio files using the TextToSpeech class from the synthesize module. The generated audio files are saved with specific filenames for later use.                                                                                                                                                                                                                                                           |
| [prompt_templates.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/prompt_templates.py)             | This code snippet, GenerateAudio.py, is a critical component of the LocaVQG Demo System Cabin AI repository. It is responsible for generating audio files.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [message.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/message.py)                               | app/ │ ├── main.py │ ├── utils.py │ └──... ├── docs/ ├── tests/ ├── config/ ├── README.md └──...```-Code snippet: ## 📝 Code Snippet```python# main.pyfrom utils import preprocess_image, run_inference# Load imageimage = preprocess_image(example.jpg)# Run inferenceresult = run_inference(image)# Print resultprint(result)```-Purpose: The code snippet demonstrates the main workflow of the LocaVQG-Demo-System-Cabin-AI repository by loading an image, preprocessing it, running an inference on it, and printing the result. It showcases the essential functions and their integration within the system. |
| [webpack.config.js](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/webpack.config.js)                 | This code snippet serves as the configuration file for the webpack build system in the parent repository. It specifies the entry point for the code, the output path, and other settings necessary for bundling JavaScript modules.                                                                                                                                                                                                                                                                                                                                                                                 |
| [timeNote](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/timeNote)                                   | This code snippet, located in the LocaVQG-Demo-System-Cabin-AI repository, contains multiple files and dependencies. It performs various tasks such as generating audio, handling chat inference, synthesizing text to speech, and object detection. The key files and their respective durations are listed, indicating their importance in the codebase's architecture.                                                                                                                                                                                                                                           |
| [test.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/test.py)                                     | This code snippet contains several functions that handle user input and generate AI responses based on observations and prompts. It also includes functions to split strings into observation and response pairs. These functions play a critical role in the conversation flow and information processing within the parent repository's architecture.                                                                                                                                                                                                                                                             |
| [synthesize.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/synthesize.py)                         | The `synthesize.py` file is responsible for generating audio from text using the Azure Text-to-Speech API. It handles token exchange and sends requests to the TTS endpoint to save the audio file. The generated audio is returned as a response.                                                                                                                                                                                                                                                                                                                                                                  |
| [textToSpeech.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/textToSpeech.py)                     | The code snippet generates an audio file from a given text input using Azure's Text-to-Speech service. It initializes speech configuration, synthesizes the text into speech, and saves the generated audio as a WAV file.                                                                                                                                                                                                                                                                                                                                                                                          |
| [package-lock.json](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/package-lock.json)                 | This code snippet, located in the HHweb directory, plays a critical role in the LocaVQG-Demo-System-Cabin-AI repository. It focuses on generating audio files and is executed by running the GenerateAudio.py script.                                                                                                                                                                                                                                                                                                                                                                                               |
| [package.json](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/package.json)                           | The code snippet, located in the `LocaVQG-Demo-System-Cabin-AI` repository, contributes to a demo system for a cabin AI. It includes various files responsible for generating audio, web interfaces, inference, object detection, and text-to-speech functionality. The code relies on dependencies such as Flask, OpenAI, Socket.IO, and others.                                                                                                                                                                                                                                                                   |
| [azure_TTS.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/azure_TTS.py)                           | This code snippet configures and utilizes the Azure Text-to-Speech API for synthesizing speech from text. It loads credentials from a YAML file and uses the Azure SDK to generate speech audio. The resulting audio is then printed to the console.                                                                                                                                                                                                                                                                                                                                                                |
| [testtest.js](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/testtest.js)                             | The code snippet is a part of the LocaVQG-Demo-System-Cabin-AI repository. It contains logic to handle street-related functionality, including playing videos, sounds, and managing game instructions.                                                                                                                                                                                                                                                                                                                                                                                                              |
| [chat_inference_package.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/chat_inference_package.py) | This code snippet is part of the LocaVQG-Demo-System-Cabin-AI repository. It includes functions to interact with the ChatGPT model for generating observations, replies, and personality traits based on user input and prompts. The code communicates with the model using the chat_inference_package.py dependency.                                                                                                                                                                                                                                                                                               |
| [chatgpt.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/chatgpt.py)                               | The code snippet is a part of the LocaVQG-Demo-System-Cabin-AI repository. It implements a timeout decorator and a Chatgpt class for chat message inference using OpenAI's GPT models. It handles API calls and retries for reliable responses.                                                                                                                                                                                                                                                                                                                                                                     |
| [app.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/app.py)                                       | This code snippet is the main file `app.py` in the LocaVQG-Demo-System-Cabin-AI repository. It consists of Flask routes that handle audio transcription, chatbot conversations, text-to-speech synthesis, and personality trait identification. The code uses various dependencies such as Azure Cognitive Services, OpenAI, and PyDub to achieve these functionalities.                                                                                                                                                                                                                                            |
| [example.txt](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/example.txt)                             | This code snippet is part of the LocaVQG-Demo-System-Cabin-AI repository. It showcases an AI solution for in-car assistance, providing real-time analysis of surroundings, traffic alerts, and engaging conversation topics for an enjoyable and safe driving experience.                                                                                                                                                                                                                                                                                                                                           |
| [ofa_object_detection.txt](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/ofa_object_detection.txt)   | This code snippet generates a textual description of an image using an object detection model. It uses dependencies such as PIL, torchvision, and transformers. The image is processed and transformed, and the model generates a description based on the image's contents.                                                                                                                                                                                                                                                                                                                                        |

</details>

<details closed><summary>HHweb.bin</summary>

| File                                                                                                                                             | Summary                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---                                                                                                                                              | ---                                                                                                                                                                                                                                                                                                                                                                                                                             |
| [flask](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/flask)                                                 | The code snippet in `HHweb/bin/flask` is responsible for executing Flask CLI commands within the codebase of the LocaVQG-Demo-System-Cabin-AI repository. It handles the command line interface interactions for the Flask framework, allowing developers to manage and control the Flask application.                                                                                                                          |
| [pip3.8](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/pip3.8)                                               | This code snippet, located in the `HHweb/bin` directory, sets up the Python environment and runs the main command-line interface for managing dependencies using `pip3.8`. Its purpose is to handle package installations and maintain the software dependencies required by the codebase.                                                                                                                                      |
| [Activate.ps1](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/Activate.ps1)                                   | The code snippet `Activate.ps1` is a script that activates a Python virtual environment for the current PowerShell session. It sets the necessary environment variables, modifies the prompt, and updates the PATH variable to use the virtual environment's Python executable. It is an important part of the repository's architecture as it enables the isolation and usage of specific Python dependencies for the project. |
| [easy_install](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/easy_install)                                   | This code snippet is a Python script that handles the installation of dependencies in the codebase's parent repository. It ensures that the required software and packages are correctly installed for the system to function properly.                                                                                                                                                                                         |
| [python](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/python)                                               | The code snippet is part of the LocaVQG-Demo-System-Cabin-AI repository. It includes a variety of files such as GenerateAudio.py, app.py, azure_TTS.py, and more. The code relies on the HHweb/bin/python dependency for its execution. The specific role and critical features of the provided code snippet are not mentioned in the information provided.                                                                     |
| [pip3](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/pip3)                                                   | This code snippet is a Python script that manages the execution of pip commands. It takes care of installing, upgrading, and removing Python packages. It is an essential tool in the software development process, ensuring that all necessary dependencies are properly handled.                                                                                                                                              |
| [find-corrupt-whisper-files.py](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/find-corrupt-whisper-files.py) | The code snippet is a Python script that finds and optionally deletes corrupt Whisper data files. It walks through a directory structure, identifies Whisper files, and checks for corruption. It can delete corrupt files and provides progress information. This functionality contributes to the data integrity and maintenance of the parent repository's architecture.                                                     |
| [easy_install-3.8](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/easy_install-3.8)                           | This code snippet, located in the `HHweb/bin` directory, is an executable file used for installing dependencies. It modifies the `sys.argv` variable and calls the `main()` function from the `setuptools` module. Its purpose is to facilitate the installation of required software and dependencies for the parent repository.                                                                                               |
| [activate.fish](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/activate.fish)                                 | The code snippet is an activation script that sets up the environment for the HHweb application by configuring variables and dependencies. It ensures that the necessary paths and software are in place for running the application.                                                                                                                                                                                           |
| [pip](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/pip)                                                     | This code snippet serves as an entry point to the codebase's main functionality. It sets up dependencies and executes the main program. It ensures that the necessary software is installed and launches the application.                                                                                                                                                                                                       |
| [activate](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/activate)                                           | The code snippet provides a script for activating and deactivating a virtual environment called HHweb in the parent repository. It sets the appropriate environment variables and modifies the system's PATH accordingly. This ensures that the required dependencies for the project are available and isolated within the virtual environment.                                                                                |
| [normalizer](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/normalizer)                                       | This code snippet is a file called `normalizer` located in the `HHweb/bin` directory of the parent repository. It is responsible for detecting and normalizing the character encoding of text files.                                                                                                                                                                                                                            |
| [openai](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/openai)                                               | This code snippet is a key file within the LocaVQG-Demo-System-Cabin-AI repository. It serves as an entry point for executing the main functionality of the HHweb/bin/openai software dependency. The code ensures the proper execution and termination of the script.                                                                                                                                                          |
| [activate.csh](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/HHweb/bin/activate.csh)                                   | This code snippet contains a shell script file called `activate.csh` that is used to activate and configure a Python virtual environment. It sets the necessary environment variables and aliases for the virtual environment, ensuring all dependencies are properly loaded and accessible for the codebase.                                                                                                                   |

</details>

<details closed><summary>templates</summary>

| File                                                                                                       | Summary                                                                                                                                                                                                                                                                                                           |
| ---                                                                                                        | ---                                                                                                                                                                                                                                                                                                               |
| [index.html](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/templates/index.html) | This code snippet contains an HTML template file that is part of the parent repository's architecture. It is responsible for defining the layout and structure of the web page, including meta tags, links to CSS and JS files, video and audio elements, as well as various media resources used in the webpage. |

</details>

---

## 🚀 Getting Started

### ⚙️ Installation

1. Clone the LocaVQG-Demo-System-Cabin-AI repository:
```sh
git clone https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI
```

2. Change to the project directory:
```sh
cd LocaVQG-Demo-System-Cabin-AI
```

3. Install the dependencies:
```sh
pip install -r requirements.txt
```

### 🤖 Running LocaVQG-Demo-System-Cabin-AI
Use the following command to run LocaVQG-Demo-System-Cabin-AI:
```sh
flask app.py
```
---

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/kennysuper007/LocaVQG-Demo-System-Cabin-AI/issues)**: Submit bugs found or log feature requests for LocaVQG-Demo-System-Cabin-AI.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone <your-forked-repo-url>
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear and concise message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

## 📄 License


This project is protected under the MIT License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---
