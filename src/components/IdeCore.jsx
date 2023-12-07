import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/Idea.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  
} from "firebase/firestore";
import Editor from "@monaco-editor/react";
import iconImage from '../img/camera.png';
import ImageUpload from "./ImageUpload";
import BreakDown from './BreakDown';
import CodeModal from './CodeModal';
import OutputModal from './OutputModal';

const IdeCore = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const dataCollectionRef = collection(db, "problems");
  const apiResCollectionRef = collection(db, "apiResponses");
  const [codeContent, setCodeContent] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [output, setOutput] = useState([{}]);
  const [finalCode, setFinalCode] = useState([{}]);
  const [rawEndPointOutput, setRawEndPointOutput] = useState(null);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isBreakDownOpen, setIsBreakDownOpen] = useState(false);

  const [editorKey, setEditorKey] = useState(0);
  const [fileName, setFileName] = useState("script.py"); 
  const editorRef = useRef(null);

  const files = {
    "script.py": {
      name: "script.py",
      language: "python",
      value: codeContent,
    },
  };

  const file = files[fileName];

  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1);
  }, [file.value]);

  useEffect(() => {
    if (apiResponse) {
      console.log("From IDE:", apiResponse);
      const { raw_ocr_output_code, encoded_image_with_boudning_boxes, delta_graph_json, indentation_graph_json, ir_algo_output_code, final_code } = apiResponse;
      
      const apiResponseData = {
        raw_ocr_output_code: raw_ocr_output_code,
        encoded_image_with_boudning_boxes: encoded_image_with_boudning_boxes,
        delta_graph_json: delta_graph_json,
        indentation_graph_json: indentation_graph_json,
        ir_algo_output_code: ir_algo_output_code,
        timestamp: new Date(), 
      };
      console.log(final_code);
      handleCodeChange(final_code);
      console.log(codeContent);
    //   addDataToApiResCollection(apiResponseData);
    }
  }, [apiResponse]); 

  const handleApiResponse = async (response) => {
    await setApiResponse(response);
  };

  const handleImageUpload = (image) => {
    console.log('Image uploaded:', image);
  };
  const handleCodeChange = (input) => {
    setCodeContent(input);
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const handleEndPoint = () => {
    fetch("http://13.59.173.12:8000/gaussian_extraction")
        .then((res) => {
            return res.text().then(text => {
              setRawEndPointOutput(text);
              return JSON.parse(text);
            });
          })
        .then((final_code) => {
        setFinalCode(final_code);
        console.log(setFinalCode);
        })
        .catch((error) => {
        console.error("Error:", error);
        });
  }

  const handleSaveCode = () => {
    let code = editorRef.current.getValue();
    // console.log(code);
    setCodeContent(code);
    
    fetch("http://13.59.173.12:8000/execute_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ final_code: code }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.output);
        console.log(data);
        setTerminalOutput((prevOutput) => prevOutput + "\n" + data.output);
      })
      .catch((error) => {
        console.error("Error:", error);
        setTerminalOutput(
          (prevOutput) => prevOutput + "\n" + "An error occurred."
        );
      });
  };

  const addDataToApiResCollection = async (data) => {
    try {
      // const stringifiedData = JSON.stringify(data);
      // await addDoc(apiResCollectionRef, { data: stringifiedData });
      await addDoc(apiResCollectionRef, data)
      console.log('Data added to apiResonses successfully!');
    } catch (error) {
      console.error('Error adding data to apiResonses:', error);
    }
  };

  return (
    <div className="wrapper" id="wrapper">
      <div className="topbar">
        <div className="title">BitSized</div>
            <div className="run-cap">
                <div>
                    <div className="capture" onClick={() => setIsImagePopupOpen(true)}>
                        <img src={iconImage} alt="Camera" />
                    </div>
                    <ImageUpload 
                    isOpen={isImagePopupOpen}
                    onClose={() => setIsImagePopupOpen(false)}
                    onImageUpload={handleImageUpload}
                    onApiResponse={handleApiResponse}
                    />
                </div>
                <button className="run-button" onClick={handleSaveCode}>
                Run
                </button>

            </div>
            
      </div>
      <div className="utils">
      <button className="problem button-1" onClick={() => setIsBreakDownOpen(true)}>
        Breakdown
      </button>
      <button className="code button-1" onClick={() => setIsCodeModalOpen(true)}>
        Code
      </button>
      <button className="output button-1" onClick={() => setIsOutputModalOpen(true)}>
        Output
      </button>
      <BreakDown
        isOpen={isBreakDownOpen}
        onClose={() => setIsBreakDownOpen(false)}
        problemData={rawEndPointOutput}
      />
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        codeData={file.value}
      />
      <OutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        outputData={output}
      />
      </div>
      <div className="container">
        
    <div className="question-container">
        <div className="header"> IDE  </div>
        <div className="question">
            You write and compile your code here. You can also capture your handwritten code and compile.
        </div>
        </div>
        
        <div className="output-container">
          <div className="editor">
            <div className="title">main.py</div>
            <div className="editor-component">
              <Editor
                key={editorKey}
                height="300px"
                width="100%"
                theme="vs-light"
                onMount={handleEditorDidMount}
                path={file.name}
                defaultLanguage={file.language}
                defaultValue={file.value}
              />
            </div>
          </div>
          <div className="terminal-output">
            <div className="title">Terminal</div>
            {typeof output === "string" ? (
                output.split('\n').map((line, i) => (
                <div key={i} className="terminal-line">
                    {line}
                </div>
                ))
            ) : (
                <div className="terminal-line">|</div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default IdeCore;
