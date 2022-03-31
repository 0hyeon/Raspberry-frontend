import React, { useMemo, useCallback, memo } from 'react'
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; // react-quill과 css파일 import 하기

const QuillEditor2 = memo(({ quillRef2, api2, htmlContent2, setHtmlContent2 }) => {
    // 툴바의 사진 아이콘 클릭시 기존에 작동하던 방식 대신에 실행시킬 핸들러를 만들어주자.
    const imageHandler = useCallback(() => {
        const formData = new FormData(); // 이미지를 url로 바꾸기위해 서버로 전달할 폼데이터 만들기
        
        const input = document.createElement("input"); // input 태그를 동적으로 생성하기
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*"); // 이미지 파일만 선택가능하도록 제한
        input.setAttribute("name", "image");
        input.click(); 

        // 파일 선택창에서 이미지를 선택하면 실행될 콜백 함수 등록
        
    }, [api2, quillRef2]);
  
    const modules2 = useMemo(
        () => ({
            toolbar: { // 툴바에 넣을 기능들을 순서대로 나열하면 된다.
                container: [
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                        { align: [] },
                    ]
                ],
                handlers: { // 위에서 만든 이미지 핸들러 사용하도록 설정
                    image: imageHandler,
                },
            },
        }), [imageHandler]);
    return (
        <>
            <ReactQuill
                ref={quillRef2}
                value={htmlContent2}
                onChange={setHtmlContent2}
                modules={modules2}
                theme="snow"
                className="ReactQuilTarget"
            />
        </>
    )
})

export default QuillEditor2