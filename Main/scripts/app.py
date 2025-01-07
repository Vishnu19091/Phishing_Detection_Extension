# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd

# app = Flask(__name__)

# # Load the models
# models = {
#     "decision_tree": joblib.load("D:\clg\Project Phase 1\Project\Main\modelphishing_detection_model_DecisionTreeClassifier().pkl"),
# }

# @app.route('/predict', methods=['POST'])
# def predict():
#     # Parse the incoming JSON request
#     data = request.get_json()

#     # Extract model type from the request
#     model_type = data.get('model_type', 'decision_tree').lower()
#     if model_type not in models:
#         return jsonify({'error': 'Invalid model type. Choose from decision_tree, random_forest, extra_tree.'}), 400

#     # Extract features for prediction
#     features = data.get('features')
#     if not features:
#         return jsonify({'error': 'No features provided for prediction.'}), 400

#     # Convert features to DataFrame
#     input_data = pd.DataFrame([features])

#     # Perform prediction
#     model = models[model_type]
#     prediction = model.predict(input_data)
#     response = {
#         'model': model_type,
#         'prediction': int(prediction[0])
#     }

#     return jsonify(response)

# if __name__ == '__main__':
#     app.run(debug=True)

