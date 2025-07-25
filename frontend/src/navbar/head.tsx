

import './head.css';
import { motion } from 'framer-motion';

const Head = () => {
    return (
        <div className="head">
            <motion.h1
                className="head-logo-text"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                TRIP PLANNER
            </motion.h1>
        </div>
    );
};

export default Head;
