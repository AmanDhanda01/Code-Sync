import React, { useState,useRef, useEffect } from 'react'

import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/dev/vs/editor/editor.main.css';
import Actions from '../Action';







function Editor({socketRef,roomId,codeValue,onCodeChange}){


  const [code, setCode] = useState(codeValue);
 

    // Clean up the event listener when the component unmounts


  const editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    // You can do something with the editor instance if needed
    editor.onDidChangeModelContent(() => {
      // Getting the updated code from the editor
      const newCode = editor.getValue();
      onCodeChange(newCode); 
      if(newCode!==code){
        setCode(newCode);
        // console.log('Current code:', newCode);
        socketRef.current.emit(Actions.CODE_CHANGE,{
              roomId,
              newCode
        });
      }
     });

    
  };

  useEffect(() => {
    // Add an event listener for CODE_CHANGE when the component mounts
    if(socketRef.current){
      socketRef.current.on(Actions.CODE_CHANGE, ({ newCode }) => {
        setCode(newCode);
      });
    }
   
  
    // Clean up the event listener when the component unmounts
    return () => {
      socketRef.current.off(Actions.CODE_CHANGE);
    };
  }, [socketRef.current]);
  
 


 


  const options = {
    fontSize: 18,
       // Adjust the font size as needed
  };
       
  return (
    <MonacoEditor
      width="84vw"
      height="100vh"
      language="javascript"
      theme="vs-dark"
      value={code}
      editorDidMount={editorDidMount}
      options={options}
    />
  );
}

export default Editor;