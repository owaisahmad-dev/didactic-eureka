### Install requirements
```
pip install -r requirements.txt
```
### Download model
```
python -m spacy download en_core_web_sm
```
### Start the server
```
flask run
```
This will launch a development server.

### You can use this curl call to test:
```
curl --location --request POST 'http://127.0.0.1:5000/predict' \
--header 'Content-Type: application/json' \
--data-raw '{
    "usr1" : ["rocks", "books"],
    "usr2" : ["books", "gardens"],
    "usr3": ["cricket", "sports"]
}'
```