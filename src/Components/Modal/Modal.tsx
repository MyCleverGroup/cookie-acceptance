import React, { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { ModalProps } from "./Modal.types";
import { storeCookies } from "../../Helpers/Utils";
import Button from "../Button";
import Type from "../Type";
import { CookieTypes } from "../../Helpers/Types";

const ModalComponent = ({
  className,
  smallText,
  largeText,
  privacyPolicyURL,
  image,
  onAccept,
  cookies,
  appName,
}: ModalProps) => {
  const [active, setActive] = useState(true);
  const [agreedCookies, setAgreedCookies] = useState<CookieTypes[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Framer Motion animation data
  const animate = {
    opacity: 1,
    translateY: 0,
    transition: {
      type: "tween",
      ease: "anticipate",
      duration: 1,
    },
  };
  const exit = {
    opacity: 0,
    translateY: 100,
    transition: {
      type: "tween",
      ease: "anticipate",
      duration: 1,
    },
  };
  const initial = { opacity: 0, translateY: 100 };

  const ModalInner = styled.div`
    padding: 30px;
  `;
  const ModalImg = styled.img`
    width: 100%;
    height: auto;
  `;
  const ExpandedActions = styled.div`
    position: sticky;
    bottom: 0;
    width: 100%;
    background: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1)
    );
    padding: 20px 0;
  `;

  const handleSingleCookieConsent = (
    cookie: CookieTypes,
    agreement: boolean
  ) => {
    if (agreement) {
      setAgreedCookies([...agreedCookies, cookie]);
    } else {
      setAgreedCookies(agreedCookies.filter((item) => item !== cookie));
    }
  };

  const handleConfirm = (all?: boolean) => {
    // Agree to all cookies provided
    if (all) {
      storeCookies(cookies, appName, onAccept);
      return;
    }
    // Agree to specific cookies
    storeCookies(agreedCookies, appName, onAccept);
  };

  const initialContent = (
    <>
      {image && <ModalImg src={image} alt="Cookie Policy" />}
      <ModalInner>
        <p>{smallText || "Please accept our cookie policy"}</p>
        <Button
          type="primary"
          click={() => handleConfirm(true)}
          text="Accept All Cookies"
        />
        <Button
          type="secondary"
          click={() => setExpanded(true)}
          text="Cookie Settings"
        />
      </ModalInner>
    </>
  );

  const expandedContent = (
    <ModalInner>
      <h2>Privacy Settings</h2>
      <p>{largeText || "Please accept our cookie policy"}</p>
      {cookies.map((cookie, index) => (
        <Type
          cookie={cookie}
          onToggle={handleSingleCookieConsent}
          agreedCookies={agreedCookies}
        />
      ))}
      <Type />
      <ExpandedActions>
        <Button
          type="primary"
          click={() => handleConfirm()}
          text="Confirm Choices"
        />
        <Button type="primary" click={() => setExpanded(false)} text="Close" />
      </ExpandedActions>
    </ModalInner>
  );

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            animate={animate}
            exit={exit}
            initial={initial}
            className={`${className} ${expanded && "expanded"}`}
          >
            {expanded ? expandedContent : initialContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Modal = styled(ModalComponent)`
  background: #fff;
  box-shadow: 0px 3px 6px #00000029;
  width: 400px;
  min-height: 400px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  overflow: hidden;
  border-radius: 10px;
  font-family: "Sofia Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont,
    Roboto, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  line-height: 20px;
  color: #363b40;
  text-align: left;
  transition: 0.25s ease;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  &.expanded {
    height: calc(100% - 60px);
    top: 30px;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    color: #363b40;
    margin-bottom: 40px;
  }
`;

export default Modal;
