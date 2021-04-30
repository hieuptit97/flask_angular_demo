from flask import Flask, jsonify, request
import pymongo
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["admin"]
mycol = mydb["client_data"]

authorization_key = "AuthorizationKeyDemoOfProject123"


@app.route('/login', methods=['POST'])
def login():

    data_input = request.json
    search_condition = []
    if data_input['email']:
        search_condition.append({'email': data_input['email']})
    if data_input['balance']:
        search_condition.append({'balance': int(data_input['balance'])})

    arr_data_return = []
    for result in mycol.find({'$and': search_condition}, {"_id": 0}):
        arr_data_return.append(result)
    if not arr_data_return:
        arr_data_return = 'No result found'
    else:
        arr_data_return = 0

    return jsonify({'result': arr_data_return})


@app.route('/dashboard', methods=['POST'])
def dashboard():

    # authentication
    token = request.headers.get('Authorization')
    if token != authorization_key:
        return jsonify({'result': 999})
    else:
        arr_data_return = []
        for one_row in mycol.find({}, {"_id": 0}):

            arr_data_return.append(one_row)

        return jsonify({'result': arr_data_return})


@app.route('/dashboard/search', methods=['POST'])
def search():

    # authentication
    token = request.headers.get('Authorization')
    if token != authorization_key:
        return jsonify({'result': 999})
    else:
        data_input = request.json
        search_condition = []
        if data_input['firstname']:
            search_condition.append({'firstname': data_input['firstname']})
        if data_input['lastname']:
            search_condition.append({'lastname': data_input['lastname']})
        if data_input['age']:
            search_condition.append({'age': int(data_input['age'])})
        if data_input['address']:
            search_condition.append({'address': data_input['address']})
        if data_input['email']:
            search_condition.append({'email': data_input['email']})
        if data_input['employer']:
            search_condition.append({'employer': data_input['employer']})
        if data_input['balance']:
            search_condition.append({'balance': int(data_input['balance'])})

        arr_data_return = []
        for result in mycol.find({'$and': search_condition}, {"_id": 0}):
            arr_data_return.append(result)
        if not arr_data_return:
            arr_data_return = 'No result found'

        return jsonify({'result': arr_data_return})


@app.route('/dashboard/insert', methods=['POST'])
def insert_client():

    # authentication
    token = request.headers.get('Authorization')
    if token != authorization_key:
        return jsonify({'result': 999})
    else:
        data_input = request.json
        data_input['account_number'] = mycol.find().count()+1,
        mycol.insert(data_input)
        response_code = 0
        return jsonify({'code': response_code})


@app.route('/dashboard/delete', methods=['POST'])
def delete_client():

    # authentication
    token = request.headers.get('Authorization')
    if token != authorization_key:
        return jsonify({'result': 999})
    else:
        data_input = request.json
        mycol.remove(data_input)
        response_code = 0
        return jsonify({'code': response_code})


@app.route('/dashboard/edit', methods=['POST'])
def edit_client():

    # authentication
    token = request.headers.get('Authorization')
    if token != authorization_key:
        return jsonify({'result': 999})
    else:
        data_input = request.json
        mycol.update_one({'account_number': data_input['account_number']}, {'$set': data_input})
        response_code = 0
        return jsonify({'code': response_code})


if __name__ == '__main__':
    app.run()
