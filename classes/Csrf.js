function Csrf(length = 60){
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=[]{}|;:,.<>/?'
    // let accepted = caracteres.split("");
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars.charAt(randomIndex);
    }
    return token;
}

module.exports = Csrf;