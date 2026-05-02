import React, { useRef } from 'react';
import { useTournament } from '../context/TournamentContext';
import MatchCard from './MatchCard';
import { ArrowLeft, Trophy, Medal, Lock, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import logoImg from '../assets/2026_FIFA_World_Cup_emblem.png';

const BracketStage = () => {
  const { bracket, selectMatchWinner, setCurrentStep } = useTournament();
  const pageRef    = useRef(null); // captures the full page for screenshot
  const bracketRef = useRef(null); // the scrollable bracket area

  // ── Round completion checks ──────────────────────
  const roundComplete = (m) => m.length > 0 && m.every(x => !!x.winner);

  const r32L = bracket.roundOf32.filter(m => m.side === 'left');
  const r32R = bracket.roundOf32.filter(m => m.side === 'right');
  const r16L = bracket.roundOf16.filter(m => m.side === 'left');
  const r16R = bracket.roundOf16.filter(m => m.side === 'right');
  const qfL  = bracket.quarterFinals.filter(m => m.side === 'left');
  const qfR  = bracket.quarterFinals.filter(m => m.side === 'right');

  const r32Complete = roundComplete(r32L) && roundComplete(r32R);
  const r16Complete = roundComplete(r16L) && roundComplete(r16R);
  const qfComplete  = roundComplete(qfL) && roundComplete(qfR);
  const sfComplete  = roundComplete(bracket.semiFinals);
  const allDone     = sfComplete && !!bracket.finalMatch?.winner && !!bracket.thirdPlaceMatch?.winner;

  // ── Column renderer ──────────────────────────────
  const renderColumn = (matches, roundKey, title, isLocked) => (
    <div className="bracket-column">
      <div className={`bracket-title ${isLocked ? 'bracket-title-locked' : ''}`}>
        {isLocked && <Lock size={9} style={{ marginRight: 3, display: 'inline', verticalAlign: 'middle' }} />}
        {title}
      </div>
      {matches.map(match => (
        <MatchCard
          key={match.id}
          match={match}
          isLocked={isLocked}
          onSelectWinner={(mId, tId) => selectMatchWinner(roundKey, mId, tId)}
        />
      ))}
    </div>
  );

  // ── Winner helpers ───────────────────────────────
  const getWinner = (match) => {
    if (!match?.winner) return null;
    return match.winner === match.team1?.id ? match.team1 : match.team2;
  };
  const champion   = getWinner(bracket.finalMatch);
  const runnerUp   = bracket.finalMatch?.winner
    ? (bracket.finalMatch.winner === bracket.finalMatch.team1?.id ? bracket.finalMatch.team2 : bracket.finalMatch.team1)
    : null;
  const thirdPlace = getWinner(bracket.thirdPlaceMatch);

  // ── Share as image ──────────────────────────────
  const handleShare = async () => {
    const page    = pageRef.current;
    const bkt     = bracketRef.current;
    if (!page || !bkt) return;

    // Expand the scroll container so all matches are visible
    const savedOverflow = bkt.style.overflowX;
    bkt.style.overflowX = 'visible';

    // Pause trophy animation
    const trophies = page.querySelectorAll('.trophy-anim');
    trophies.forEach(n => { n.style.animation = 'none'; n.style.transform = 'translateY(0)'; });

    try {
      const canvas = await html2canvas(page, {
        backgroundColor: '#0d1117',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
        width:  page.scrollWidth,
        height: page.scrollHeight,
        windowWidth:  page.scrollWidth,
        windowHeight: page.scrollHeight,
        onclone: (_doc, cloned) => {
          // Expand bracket wrapper in clone
          cloned.querySelectorAll('.bracket-inner-scroll').forEach(w => {
            w.style.overflowX = 'visible';
          });

          // Stop animations
          cloned.querySelectorAll('.champion-reveal').forEach(n => {
            n.style.animation = 'none'; n.style.opacity = '1';
          });
          cloned.querySelectorAll('.trophy-anim').forEach(n => {
            n.style.animation = 'none'; n.style.transform = 'none';
            n.style.opacity = '1'; n.style.filter = 'none';
          });

          // Fix gradient clip text (invisible in html2canvas)
          cloned.querySelectorAll('.bracket-page-header h1').forEach(n => {
            n.style.backgroundImage = 'none'; n.style.background = 'none';
            n.style.color = '#ffffff'; n.style.webkitTextFillColor = '#ffffff';
          });
          cloned.querySelectorAll('.bracket-page-header .header-eyebrow').forEach(n => {
            n.style.color = '#3CAC3B'; n.style.webkitTextFillColor = '#3CAC3B';
          });
          cloned.querySelectorAll('.champion-label').forEach(n => {
            n.style.color = '#fbbf24'; n.style.webkitTextFillColor = '#fbbf24'; n.style.opacity = '1';
          });
          cloned.querySelectorAll('.champion-team div, .champion-team span').forEach(n => {
            n.style.color = '#ffffff'; n.style.webkitTextFillColor = '#ffffff'; n.style.opacity = '1';
          });

          // Remove backdrop-filter
          cloned.querySelectorAll('*').forEach(n => {
            n.style.backdropFilter = 'none'; n.style.webkitBackdropFilter = 'none';
          });
        }
      });

      const link = document.createElement('a');
      link.download = 'wc2026-bracket.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Screenshot failed', e);
    } finally {
      bkt.style.overflowX = savedOverflow;
      trophies.forEach(n => { n.style.animation = ''; n.style.transform = ''; });
    }
  };

  return (
    // pageRef captures the full page including the centered header
    <div ref={pageRef} className="bracket-page">

      {/* ── Header: always centered, fixed-width container ── */}
      <div className="bracket-page-header">
        <img src={logoImg} alt="FIFA World Cup 2026" className="header-logo" />
        <div className="header-eyebrow">FIFA World Cup 2026™</div>
        <h1>Tournament Bracket</h1>
        <p>Follow the path to the World Cup Final</p>
        <a href="https://cemeren.dev" target="_blank" rel="noopener noreferrer" className="header-watermark">
          cemeren.dev
        </a>
      </div>

      {/* ── Bracket: horizontally scrollable ── */}
      <div ref={bracketRef} className="bracket-inner-scroll">
        <div className="bracket-container">

          {/* LEFT */}
          {renderColumn(r32L, 'roundOf32',    'R32', false)}
          {renderColumn(r16L, 'roundOf16',    'R16', !r32Complete)}
          {renderColumn(qfL,  'quarterFinals', 'QF',  !r16Complete)}
          {renderColumn(bracket.semiFinals.filter(m => m.side === 'left'), 'semiFinals', 'SF', !qfComplete)}

          {/* CENTER */}
          <div className="bracket-column center-column">
            {champion && (
              <div className="champion-reveal">
                <Trophy size={60} className="trophy-anim" color="#fbbf24" />
                <div className="champion-label">WORLD CHAMPION</div>
                <div className="champion-team">
                  <span style={{ fontSize: '2.8rem' }}>{champion.flag}</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>{champion.name}</div>
                </div>
              </div>
            )}

            <div className="match-group">
              <div className="bracket-title" style={{ color: '#fbbf24' }}>
                {!sfComplete && <Lock size={9} style={{ marginRight: 3, display: 'inline', verticalAlign: 'middle' }} />}
                Final
              </div>
              {bracket.finalMatch && (
                <MatchCard match={bracket.finalMatch} isLocked={!sfComplete}
                  onSelectWinner={(mId, tId) => selectMatchWinner('finalMatch', mId, tId)} />
              )}
            </div>

            <div className="match-group">
              <div className="bracket-title">
                {!sfComplete && <Lock size={9} style={{ marginRight: 3, display: 'inline', verticalAlign: 'middle' }} />}
                Third Place
              </div>
              {bracket.thirdPlaceMatch && (
                <MatchCard match={bracket.thirdPlaceMatch} isLocked={!sfComplete}
                  onSelectWinner={(mId, tId) => selectMatchWinner('thirdPlaceMatch', mId, tId)} />
              )}
            </div>

            {thirdPlace && (
              <>
                <div className="results-summary">
                  <div className="result-item"><Medal size={18} color="#fbbf24" /> <span>🥇 {champion?.name}</span></div>
                  <div className="result-item"><Medal size={18} color="#aaa" />    <span>🥈 {runnerUp?.name}</span></div>
                  <div className="result-item"><Medal size={18} color="#cd7f32" /> <span>🥉 {thirdPlace?.name}</span></div>
                </div>
                <div className="simulate-banner">
                  Want to see these matches played out? ⚽<br />
                  <a href="https://cemeren.dev/rotascore" target="_blank" rel="noopener noreferrer">
                    Simulate on RotaScore →
                  </a>
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          {renderColumn(bracket.semiFinals.filter(m => m.side === 'right'), 'semiFinals', 'SF', !qfComplete)}
          {renderColumn(qfR,  'quarterFinals', 'QF',  !r16Complete)}
          {renderColumn(r16R, 'roundOf16',    'R16', !r32Complete)}
          {renderColumn(r32R, 'roundOf32',    'R32', false)}

        </div>
      </div>

      {/* ── Actions: always centered ── */}
      <div className="bracket-actions">
        <button className="btn-secondary" onClick={() => setCurrentStep(2)}>
          <ArrowLeft size={20} /> Back
        </button>
        {allDone && (
          <button className="btn-share" onClick={handleShare}>
            <Share2 size={20} /> Share Bracket
          </button>
        )}
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Reset Tournament
        </button>
      </div>
    </div>
  );
};

export default BracketStage;
