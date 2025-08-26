import { useState } from "react";
import { spin } from "./Api";

export default function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [error, setError] = useState("");

  // Formata o telefone enquanto digita
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };

  // Valida o formulário
  const validateForm = () => {
    if (!name.trim()) {
      setError("Por favor, informe seu nome");
      return false;
    }
    
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      setError("Telefone deve estar no formato (00) 00000-0000");
      return false;
    }

    setError("");
    return true;
  };

  // Efeito de slot machine
  const animateSlot = (segments: string[], targetWord: string) => {
    let duration = 0;
    const iterations = 20; // número de palavras que vai mostrar antes de parar
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * segments.length);
      setCurrentWord(segments[randomIndex]);
      duration++;

      if (duration >= iterations) {
        clearInterval(interval);
        setCurrentWord(targetWord);
        setSpinning(false);
      }
    }, 100); // velocidade da troca de palavras
  };

  const handleSpin = async () => {
    if (!validateForm()) return;
    setSpinning(true);

    try {
      const res = await spin({ name, phone });
      animateSlot(res.segments, res.giftName ?? "Boa Sorte!");
      
      // Mostra o popup após a animação
      setTimeout(() => {
        alert(res.message);
      }, 2200); // 2.2 segundos (20 iterações * 100ms + um pouco mais)
    } catch (err) {
      setError("Erro ao realizar o sorteio. Tente novamente.");
      setSpinning(false);
    }
  };

  return (
    <div className="container">
      <style>{`
        .container {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: #f8f9fa;
        }
        .card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 24px #0001;
          width: 100%;
          max-width: 400px;
        }
        .form {
          display: grid;
          gap: 16px;
        }
        .input {
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #4263eb;
          outline: none;
        }
        .button {
          background: #4263eb;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .button:hover:not(:disabled) {
          background: #364fc7;
        }
        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .slot {
          margin-top: 24px;
          padding: 24px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
          min-height: 80px;
          display: grid;
          place-items: center;
        }
        .prize {
          font-size: 24px;
          font-weight: bold;
          color: #4263eb;
        }
        .error {
          color: #e03131;
          font-size: 14px;
          margin-top: 8px;
        }
      `}</style>

      <div className="card">
        <h1 style={{textAlign: "center", marginBottom: "24px"}}>Sorteio de Brindes</h1>
        
        <div className="form">
          <input
            className="input"
            placeholder="Seu nome"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={spinning}
          />
          
          <input
            className="input"
            placeholder="Telefone/WhatsApp"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            disabled={spinning}
          />

          {error && <div className="error">{error}</div>}

          <button 
            className="button"
            onClick={handleSpin}
            disabled={spinning}
          >
            {spinning ? "Girando..." : "Girar"}
          </button>

          <div className="slot">
            <div className="prize">
              {currentWord || "Boa Sorte!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}