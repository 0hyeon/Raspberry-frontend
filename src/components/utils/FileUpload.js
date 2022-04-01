import React,{useState} from 'react'
import Dropzone from 'react-dropzone'
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import {API_URL} from "../../config/constants.js";
const FileUpload = (props) => {
    const [ Images, setImages ] = useState([]);
    const dropHandler = (files) => {
        let formData = new FormData();

        const config = {
            header: { 'content-type' : 'multipart/form-data' }
        }

        formData.append("file",files[0]);
       
        axios.post(`${API_URL}/v1/banner/setBanner`,formData,config)
        .then((res) => {
            if(res.data.success){
                console.log('/v1/banner/setBanner',res.data);
                setImages([...Images, res.data.filePath])//있던거에 추가 추가 ([1,2,3])
                props.refreshFunction([...Images, res.data.filePath]) 
            }else{
                alert('파일을 저장하는데 실패했습니다.');
            }
            
        // alert("배너등록 완료");
        // history.replace('/');//이전페이지의 기록이 사라지고 대체됨
        }).catch((error) => {
        console.log(error);
        });

    }
    const deleteHandler =  (image) => {
        
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]

        newImages.splice(currentIndex,1)//currentIndex 부터 한개만 지운다 즉 본인만 
        setImages(newImages)
        props.refreshFunction(newImages) 
    }
    return (
        <div style={{ display:'flex', justifyContent:'space-between' ,width:'800px',margin:"0 auto" }}>
            <Dropzone onDrop={dropHandler}>
            {({getRootProps, getInputProps}) => (
                <div style={{ 
                    width:300, height:240, border:'1px solid lightgrey',
                    display: 'flex', alignItems:'center', justifyContent:'center'
                }} 
                {...getRootProps()}>
                <input {...getInputProps()} />
                <PlusOutlined style={{ fontSize:'3rem'}}/>
                </div>
            )}
            </Dropzone>
            <div style={{display:'flex',width:'350px',height:'240px',overflowX:'scroll'}}>
                {Images.map((image,index)=>(
                    <div onClick={ ()=> deleteHandler(image)} key={index}>
                        {/* 로컬일때 */}
                        <img style={{width:'350px',height:'100%',padding:'0px 15px'}} 
                            src={
                                process.env.NODE_ENV === 'production' ? `${image}`
                                : `${API_URL}/${image}`
                            } alt="hello"
                        />
                    </div>

                ))}
            </div>
        </div>
    )
}

export default FileUpload