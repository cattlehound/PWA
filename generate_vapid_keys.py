import ecdsa

def generate_vapid_keypair():
    """
    Generate a new set of key-pair for VAPID in PEM format
    """
    sk = ecdsa.SigningKey.generate(curve=ecdsa.NIST256p)
    vk = sk.get_verifying_key()

    private_key_pem = sk.to_pem()
    public_key_pem = vk.to_pem()

    with open("private_key.pem", "wb") as f:
        f.write(private_key_pem)

    with open("public_key.pem", "wb") as f:
        f.write(public_key_pem)

    print("VAPID keys generated and saved.")

generate_vapid_keypair()
