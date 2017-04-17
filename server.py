from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    """ Homepage """

    return render_template('index.html')


if __name__ == "__main__":
    #app.debug = False

    #connect_to_db(app, 'asgard_db')

    # Use the DebugToolbar
    #DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
