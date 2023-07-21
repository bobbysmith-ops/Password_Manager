const crypto = require("crypto")//dont need to install anything, comes w node
const secret = 'pppppppppppppppppppppppppppppppp'//secret variable, needs to be 32 characters for this algorithm


const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16))//iv is like an identifier for you encryption
    const cipher = crypto.createCipheriv('aes-256-ctr',Buffer.from(secret), iv)//here's where we actually encrypt
    const encryptedPassword = Buffer.concat([cipher.update(password),cipher.final()])//this is the result of the encryption
    return {iv:iv.toString("hex"), password: encryptedPassword.toString("hex")}//have to transform the buffer into a string
}


const decrypt = (encryption)=>{
    const decipher = crypto.createDecipheriv('aes-256-ctr',Buffer.from(secret), Buffer.from(encryption.iv,"hex"))

    const decryptedPassword = Buffer.concat([
        decipher.update(Buffer.from(encryption.password, "hex")),
        decipher.final()
    ])

    return decryptedPassword.toString()
}

module.exports = {encrypt,decrypt}


