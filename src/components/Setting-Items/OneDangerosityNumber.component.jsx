import { useState, useRef } from "react";

function OneDangerosityNumber({ title, children }) {
  const [ouvert, setOuvert] = useState(false);
  const contentRef = useRef(null);

  const handleClick = () => setOuvert(!ouvert);

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "1.5rem auto" }}>
      <div
        onClick={handleClick}
        style={{
          cursor: "pointer",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "1rem",
          backgroundColor: "white",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: "700",
            userSelect: "none",
          }}
        >
          {ouvert ? `${title}` : `${title}`}
        </h2>

        <div
          style={{
            overflow: "hidden",
            transition: "all 0.5s ease",
            height: ouvert ? contentRef.current?.scrollHeight : 0,
          }}
        >
          <div
            ref={contentRef}
            style={{
              padding: "1rem",
              backgroundColor: "#f3f3f3",
              borderRadius: "1rem",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OneDangerosityNumber;
