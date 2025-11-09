<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import './MagicBento.css';

const cardData = [
  {
    id: 'sand',
    title: 'Pedaço de areia',
    description: 'Universo dos astros eternos',
    label: 'Motion Comic'
  },
  {
    id: 'um',
    title: 'Em produção',
    description: 'SECRET',
    label: 'Motion Comic'
  },
  {
    id: 'project3',
    title: 'Em produção',
    description: 'Quadrinhos online',
    label: 'SECRET'
  },
  {
    id: 'project4',
    title: 'Em produção',
    description: 'SECRET',
    label: 'SECRET'
  }
];

function BentoCard({ id, title, description, label }) {
  return (
    <Link to={`/video/${id}`} className="magic-bento-link">
      <div className="magic-bento-card">
        <div className="magic-bento-card__header">
          <div className="magic-bento-card__label">{label}</div>
        </div>
        <div className="magic-bento-card__content">
          <h2 className="magic-bento-card__title">{title}</h2>
          <p className="magic-bento-card__description">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function MagicBento() {
  return (
    <div className="card-grid">
      {cardData.map((card, index) => (
        <BentoCard key={index} {...card} />
      ))}
    </div>
  );
=======
import React from 'react';
import { Link } from 'react-router-dom';
import './MagicBento.css';

const cardData = [
  {
    id: 'sand',
    title: 'Pedaço de areia',
    description: 'Universo dos astros eternos',
    label: 'Motion Comic'
  },
  {
    id: 'um',
    title: 'Em produção',
    description: 'SECRET',
    label: 'Motion Comic'
  },
  {
    id: 'project3',
    title: 'Em produção',
    description: 'Quadrinhos online',
    label: 'SECRET'
  },
  {
    id: 'project4',
    title: 'Em produção',
    description: 'SECRET',
    label: 'SECRET'
  }
];

function BentoCard({ id, title, description, label }) {
  return (
    <Link to={`/video/${id}`} className="magic-bento-link">
      <div className="magic-bento-card">
        <div className="magic-bento-card__header">
          <div className="magic-bento-card__label">{label}</div>
        </div>
        <div className="magic-bento-card__content">
          <h2 className="magic-bento-card__title">{title}</h2>
          <p className="magic-bento-card__description">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function MagicBento() {
  return (
    <div className="card-grid">
      {cardData.map((card, index) => (
        <BentoCard key={index} {...card} />
      ))}
    </div>
  );
>>>>>>> 44a7f3b879c725c09f28c9c778173d391d17fe78
}