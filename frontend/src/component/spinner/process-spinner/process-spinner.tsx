import './process-spinner.css'

const ProcessSpinner = () => {
    return (
        <div className="spinnerContainer">
            <div className="spinner"></div>
            <div className="loader">
                <p>Process</p>
                <div className="words">
                    <span className="word">user</span>
                    <span className="word">condition</span>
                    <span className="word">landmark</span>
                    <span className="word">restaurant</span>
                    <span className="word">hotel</span>
                </div>
            </div>
        </div>
    )
}

export default ProcessSpinner