function validation(values){
    let error= {}
    const password_pattern= /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*+`~=?\|<>/]).{8,}/
    
    if(values.name===""){
        error.name="Name should not be empty"
    }
    else {
        error.name=""
    }
    if(values.username===""){
        error.username="Username should not be empty"
    }
    else {
        error.username=""
    }
    
    if(values.email===""){
        error.email="Email should not be empty"
    }
    else{
        error.email=""
    }


    if(values.password===""){
        error.password="Password should not be empty"
    }else if(!password_pattern.test(values.password)){
        error.password="Please input proper password"
            }
    else{
        error.password=""
    }
    if(values.address===""){
        error.address="Address should not be empty"
    }
    else {
        error.address=""
    }
    if(values.phone===""){
        error.phone="Phone No. should not be empty"
    }
    else {
        error.phone=""
    }
return error;
}
export default validation;