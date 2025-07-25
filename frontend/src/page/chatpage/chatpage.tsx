import Chat from "../../component/chat/chat";
import './chatpage.css';
import Recommend from "../../component/recommend/recommend";
import Map from "../../component/map/map";
import Navbar from "../../navbar/navbar";

const ChatPage = () => {
    return (
        <div className="chat-page-container">
                <Navbar />
            <div className="chat-page-content">
                <div className="chat-page-section-1">
                    <div className="chat-page-messages"><Chat /></div>
                </div>
                <div className="chat-page-section-2">
                    <div className="chat-page-recommend"><Recommend /></div>
                    <div className="chat-page-map"><Map /></div>
                </div>
            </div>
        </div>
    );
};
export default ChatPage;