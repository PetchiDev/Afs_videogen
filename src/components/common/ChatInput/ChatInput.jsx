import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatInput.module.css';
import SearchIcon from '@/assets/icons/Search.svg';

const ChatInput = ({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  maxLength = 1000
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatInputContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.inputField}
          disabled={disabled}
          maxLength={maxLength}
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          aria-label="Send message"
        >
          <img src={SearchIcon} alt="Send" className={styles.searchIcon} />
        </button>
      </div>
    </div>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number
};

export default ChatInput;
