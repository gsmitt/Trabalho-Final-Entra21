import './styles.css';
import React from 'react';

export function NotFound() {
    return (
        <div className="not_found">
             <p className="text-1">Desculpe... página não encontrada :(</p>
            <img className="image-404" src="data:image/png;base64,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" alt=""/>
           
            <p className="text-2">Talvez o link que você está pode ter sido quebrado ou a página pode ter sido removida.</p>
            <button className="botao"><a href="/">Voltar</a></button>

        </div>
    );
}

export default NotFound;