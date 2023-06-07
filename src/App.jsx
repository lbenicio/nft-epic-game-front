/*
 * Nós vamos precisar usar estados agora! Não esqueça de importar useState
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants"
import { ethers } from "ethers";
import Arena from './Components/Arena';
import LoadingIndicator from "./Components/LoadingIndicator";

// Constantes
const TWITTER_HANDLE = "lbenicio_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
import myEpicGame from "./utils/MyEpicGame.json";
import twitterLogo from "./assets/twitter-logo.svg";

const App = () => {
  /*
   * Só uma variável de estado que vamos usar para armazenar a carteira pública do usuário.
   */
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Métodos de renderização
  const renderContent = () => {
      if (isLoading) {
        return <LoadingIndicator />;
      }

  
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
            alt="Nascimento Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Conecte sua carteira para começar
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  	/*
  	* Se tiver uma carteira conectada e um personagem NFT, é hora de batalhar!
  	*/
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />

    }
  };

  /*
   * Já que esse método vai levar um tempo, lembre-se de declará-lo como async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Parece que você não tem a metamask instalada!");
        /*
         * Nós configuramos o isLoading aqui porque usamos o return na proxima linha
         */
        setIsLoading(false);
        return;
      } else {
        console.log("Objeto ethereum encontrado:", ethereum);
  
        const accounts = await ethereum.request({ method: "eth_accounts" });
  
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada:", account);
          setCurrentAccount(account);
        } else {
          console.log("Não foi encontrada uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
    /*
     * Nós lançamos a propriedade de estado depois de toda lógica da função
     */
    setIsLoading(false);
  };
  
  /*
   * Implementa o seu método connectWallet aqui
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Contectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFTMetadata = async () => {
    console.log("Verificando pelo personagem NFT no endereço:", currentAccount);
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );
    
    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log("Usuário tem um personagem NFT");
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log("Nenhum personagem NFT foi encontrado");
    }
};

  useEffect(() => {
    /*
     * Quando nosso componente for montado, tenha certeza de configurar o estado de carregamento
     */
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);
  
  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Verificando pelo personagem NFT no endereço:", currentAccount)
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        console.log("Usuário tem um personagem NFT")
        setCharacterNFT(transformCharacterData(characterNFT))
      } else {
        console.log("Nenhum personagem NFT foi encontrado")
      }
  
      /*
       * Uma vez que tivermos acabado a busca, configure o estado de carregamento para falso.
       */
      setIsLoading(false);
    };
  
    if (currentAccount) {
      console.log("Conta Atual:", currentAccount)
      fetchNFTMetadata();
    }
  }, [currentAccount]);
  
  useEffect(() => {
    checkIfWalletIsConnected();
      const checkNetwork = async () => {
        try {
          if (window.ethereum.networkVersion !== "5") {
            alert("Please connect to Goerli!");
          }
        } catch (error) {
          console.log(error);
        }
    };
  }, []);

  /*
  * Adicione esse useEffect logo embaixo do outro useEffect que você está chamando             checkIfWalletIsConnected
  */
  useEffect(() => {
    /*
     * A função que vamos chamar que interage com nosso contrato inteligente
     */
    const fetchNFTMetadata = async () => {
      console.log("Verificando pelo personagem NFT no endereço:", currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("Usuário tem um personagem NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("Nenhum personagem NFT foi encontrado");
      }
    };
  
    /*
     * Nós so queremos rodar isso se tivermos uma wallet conectada
     */
    if (currentAccount) {
      console.log("Conta Atual:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Batalhas no Metaverso ⚔️</p>
          <p className="sub-text">Junte os amigos e proteja o Metaverso!!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;