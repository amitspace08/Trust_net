export function isValidPhone(

    phone:string

){

    return /^\+?[0-9]{10,15}$/.test(phone);

}
