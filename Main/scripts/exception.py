from fastapi import HTTPException, status

# Exceptions
def http_exception():
    raise HTTPException(status_code=404, detail="Something went wrong!")

def url_http_exception():
    raise HTTPException(status_code=404, detail="Please enter a valid URL!")


def login_exception():
    return HTTPException(status_code=401, detail="User not logged in!")
    
def get_user_exception():
    credentials_exception= HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                                         detail="Could not validate credentials",
                                         headers={"WWW-Authenticate":"Bearer"})
    return credentials_exception
