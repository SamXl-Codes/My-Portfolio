
from flask import Flask, render_template, send_from_directory

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/experience')
def experience():
    return render_template('experience.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/download_resume')
def download_resume():
    return send_from_directory('static/', 'SamuelOgunlusi-Resume.pdf', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)  # Remove for Vercel deployment