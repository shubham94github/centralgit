import React, { memo, useEffect, useRef, useState } from "react";
import { bool, oneOfType, string, func, object } from "prop-types";
import Avatar from "@components/_shared/form/Avatar";
import { dateFormatCorrection } from "@utils";
import { chatMessageType, userAvatarType } from "@constants/types";
import enums from "@constants/enums";
import { colors } from "@colors";
import Markdown from "markdown-to-jsx";
import { Icons } from "@icons";
import cn from "classnames";

import "./Message.scss";

const delayForHighLight = 1000;

function Message({
  message,
  avatar,
  isUserMessage,
  foundMessage,
  messageListNode,
  setFoundMessage,
}) {
  const anchorRef = useRef();
  const [isHighlight, setIsHighlight] = useState(false);
  const classes = cn("message-content", {
    "user-message": isUserMessage,
  });

  const { createdAt, text, id, messageStatus } = message;
  const isRead = messageStatus === enums.chatMessagesStatuses.read;
  const isSent = !!id;

  const highlightMessage = () => {
    setIsHighlight(true);

    return setTimeout(() => {
      setIsHighlight(false);
      setFoundMessage(null);
    }, delayForHighLight);
  };

  useEffect(() => {
    if (!messageListNode || !foundMessage) return;

    if (foundMessage?.id === message?.id) {
      anchorRef.current.click();

      // eslint-disable-next-line operator-assignment,react/prop-types
      messageListNode.scrollTop = messageListNode.scrollTop - 20;
      highlightMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundMessage, message, messageListNode]);

  return (
    <div
      className={`message${isHighlight ? " highlighted" : ""}${
        isUserMessage ? " justify-content-end user-message" : ""
      }`}
    >
      <a
        ref={anchorRef}
        href={`#message-${message.id}`}
        id={`message-${message.id}`}
      />
      {!isUserMessage && (
        <div className="user-avatar">
          <Avatar avatar={avatar} />
        </div>
      )}
      <div className={classes}>
        <div className="message-header">
          <span>{dateFormatCorrection(createdAt, "h:mm a")}</span>
          {isSent && isUserMessage && (
            <span className="read-status">
              {isRead
                ? Icons.doubleTick(colors.darkblue70)
                : Icons.singleTick(colors.darkblue70)}
            </span>
          )}
        </div>
        <div className="message-text" id={message.id}>
          <Markdown options={{ forceInline: true, wrapper: "div" }}>
            {text}
          </Markdown>
        </div>
      </div>
    </div>
  );
}

Message.propTypes = {
  message: chatMessageType,
  avatar: userAvatarType,
  isUserMessage: bool,
  connectionStatus: oneOfType([string, bool]),
  foundMessage: chatMessageType,
  messageListNode: object,
  setFoundMessage: func.isRequired,
};

export default memo(Message);
