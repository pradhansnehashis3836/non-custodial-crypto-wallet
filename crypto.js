async function encrypt(text, password) {
const enc = new TextEncoder();
const key = await crypto.subtle.importKey(
"raw",
enc.encode(password),
"PBKDF2",
false,
["deriveKey"]
);


const derivedKey = await crypto.subtle.deriveKey(
{
name: "PBKDF2",
salt: enc.encode("wallet-salt"),
iterations: 100000,
hash: "SHA-256"
},
key,
{ name: "AES-GCM", length: 256 },
false,
["encrypt"]
);


const iv = crypto.getRandomValues(new Uint8Array(12));
const encrypted = await crypto.subtle.encrypt(
{ name: "AES-GCM", iv },
derivedKey,
enc.encode(text)
);


return {
iv: Array.from(iv),
data: Array.from(new Uint8Array(encrypted))
};
}


async function decrypt(encrypted, password) {
const enc = new TextEncoder();
const key = await crypto.subtle.importKey(
"raw",
enc.encode(password),
"PBKDF2",
false,
["deriveKey"]
);


const derivedKey = await crypto.subtle.deriveKey(
{
name: "PBKDF2",
salt: enc.encode("wallet-salt"),
iterations: 100000,
hash: "SHA-256"
},
key,
{ name: "AES-GCM", length: 256 },
false,
["decrypt"]
);


const decrypted = await crypto.subtle.decrypt(
{ name: "AES-GCM", iv: new Uint8Array(encrypted.iv) },
derivedKey,
new Uint8Array(encrypted.data)
);


return new TextDecoder().decode(decrypted);
}