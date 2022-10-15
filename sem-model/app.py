import spacy
from scipy.spatial.distance import euclidean, pdist, squareform, cosine
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)
nlp = spacy.load('en_core_web_sm')


def similarity_func(u, v):
    Aflat = np.hstack(u)
    Bflat = np.hstack(v)
    sim = cosine(Aflat, Bflat)
    return sim


@app.route('/predict', methods=['POST'])
def predict():

    body = request.get_json()

    user_interests = {}
    for user in body.keys():
        vals = body[user]
        user_interests[user] = [nlp(v).vector for v in vals]
    DF_var = pd.DataFrame.from_dict(user_interests)
    DF_var = DF_var.transpose()
    dists = pdist(DF_var, similarity_func)
    df_cosine = pd.DataFrame(squareform(
        dists), columns=DF_var.index, index=DF_var.index)

    out = []
    for user in body.keys():
        temp = df_cosine.loc[df_cosine[user] < 0.31]
        if temp.index.to_list() not in out:
            out.append(temp.index.to_list())
    print(df_cosine)
    return jsonify({'groups': out}) 


if __name__ == "__main__":
    app.run(debug=True)
