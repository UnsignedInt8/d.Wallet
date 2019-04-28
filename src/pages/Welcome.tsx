import * as React from 'react';
import Particles from 'react-particles-js';
import '../styles/Welcome.scss';
import anime from 'animejs';
import { getLang } from '../i18n';
import AnimeHelper from '../lib/AnimeHelper';
import RecoverKey from './RecoverKey';
import NewKey from './NewKey';
import Application from '../Application';

const i18n = getLang();

const nightSky: any = {
    "particles": {
        "number": {
            "value": 500,
            "density": {
                "enable": true,
                "value_area": 1000
            }
        },
        "line_linked": {
            "enable": true,
            "opacity": 0.01
        },
        "move": {
            "direction": "right",
            "speed": 0.15
        },
        "size": {
            "value": 1
        },
        "opacity": {
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.05
            }
        }
    },
    "interactivity": {
        "events": {
            "onclick": {
                "enable": true,
                "mode": "push"
            }
        },
        "modes": {
            "push": {
                "particles_nb": 1
            }
        }
    },
    "retina_detect": true
};

interface State {
    expandRecoverKey: boolean;
    expandNewKey: boolean;
}

class Welcome extends React.Component<{}, State> {

    state: State = { expandNewKey: false, expandRecoverKey: false };

    componentDidMount() {
        anime({
            targets: '#logo path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: function (el, i) { return i * 250 },
            direction: 'alternate',
            loop: false,
            complete: () => anime({
                targets: '#slogan',
                opacity: 1,
                duration: 3000
            }),
        });
    }

    private expandPage(page: 'recover' | 'create') {
        anime({
            targets: '.welcome-content, .welcome-buttons',
            opacity: 0,
        });

        this.setState({ expandNewKey: page === 'create', expandRecoverKey: page === 'recover' }, () => {
            AnimeHelper.expandPage('#expanding-page', window.innerHeight, 0);
        });
    }

    private closePage(page: 'recover' | 'create') {
        anime({
            targets: '.welcome-content, .welcome-buttons',
            opacity: 1,
            delay: 500,
        });
        this.componentDidMount();

        AnimeHelper.expandPage('#expanding-page', 0, window.innerHeight, () => this.setState({ expandNewKey: false, expandRecoverKey: false }));
    }

    private onOk() {
        Application.history.push('/');
    }

    render() {
        return (
            <div className='welcome-page'>
                <Particles className='particlejs' params={nightSky} width={`100%`} height={`100%`} />

                <div className='questrial welcome-content'>
                    <div>
                        <svg id='logo' version="1.1" width="177.225" height="50.977" viewBox="0 0 256.225 50.977">
                            <g id="svgGroup" strokeLinecap="round" fillRule="evenodd" fontSize="0pt" stroke="#fff" strokeWidth="1" fill="none" className="lines">
                                <path stroke='rgb(187, 255, 0)' d="M 30.313 50.4 L 30.313 44.64 Q 25.993 50.976 17.425 50.976 A 18.221 18.221 0 0 1 11.172 49.942 A 15.891 15.891 0 0 1 4.753 45.576 A 18.614 18.614 0 0 1 0.078 34.352 A 24.433 24.433 0 0 1 0.001 32.4 A 21.406 21.406 0 0 1 1.011 25.701 A 18.105 18.105 0 0 1 4.753 19.224 A 16.19 16.19 0 0 1 15.501 13.937 A 22.553 22.553 0 0 1 17.785 13.824 Q 25.921 13.824 30.313 20.232 L 30.313 0 L 35.713 0 L 35.713 50.4 L 30.313 50.4 Z M 18.145 46.08 A 13.572 13.572 0 0 0 22.29 45.477 A 10.796 10.796 0 0 0 27.361 42.048 A 13.452 13.452 0 0 0 30.372 35.356 A 18.42 18.42 0 0 0 30.601 32.4 A 17.249 17.249 0 0 0 30.045 27.916 A 13.129 13.129 0 0 0 27.361 22.752 Q 23.977 18.72 18.145 18.72 A 13.36 13.36 0 0 0 13.523 19.49 A 11.661 11.661 0 0 0 8.785 22.752 A 13.302 13.302 0 0 0 5.563 29.945 A 18.039 18.039 0 0 0 5.401 32.4 A 16.504 16.504 0 0 0 6.003 36.962 A 12.936 12.936 0 0 0 8.785 42.048 A 11.827 11.827 0 0 0 17.433 46.064 A 15.898 15.898 0 0 0 18.145 46.08 Z" id="0" vectorEffect="non-scaling-stroke" />
                                <path stroke='rgb(0, 195, 255)' d="M 44.209 43.056 L 51.193 43.056 L 51.193 50.4 L 44.209 50.4 L 44.209 43.056 Z" id="1" vectorEffect="non-scaling-stroke" />
                                <path stroke='rgb(255, 0, 149)' d="M 86.833 10.368 L 73.945 50.4 L 67.825 50.4 L 52.993 2.736 L 58.681 2.736 L 70.921 42.768 L 83.737 2.736 L 89.929 2.736 L 102.745 42.768 L 114.985 2.736 L 120.673 2.736 L 105.841 50.4 L 99.721 50.4 L 86.833 10.368 Z" id="2" vectorEffect="non-scaling-stroke" />
                                <path stroke='#1988f7' d="M 151.705 50.4 L 151.705 44.64 Q 147.385 50.976 138.817 50.976 A 18.221 18.221 0 0 1 132.564 49.942 A 15.891 15.891 0 0 1 126.145 45.576 A 18.614 18.614 0 0 1 121.47 34.352 A 24.433 24.433 0 0 1 121.393 32.4 A 21.406 21.406 0 0 1 122.403 25.701 A 18.105 18.105 0 0 1 126.145 19.224 A 16.19 16.19 0 0 1 136.893 13.937 A 22.553 22.553 0 0 1 139.177 13.824 Q 147.313 13.824 151.705 20.232 L 151.705 14.4 L 157.105 14.4 L 157.105 50.4 L 151.705 50.4 Z M 139.537 46.08 A 13.572 13.572 0 0 0 143.682 45.477 A 10.796 10.796 0 0 0 148.753 42.048 A 13.452 13.452 0 0 0 151.764 35.356 A 18.42 18.42 0 0 0 151.993 32.4 A 17.249 17.249 0 0 0 151.437 27.916 A 13.129 13.129 0 0 0 148.753 22.752 Q 145.369 18.72 139.537 18.72 A 13.36 13.36 0 0 0 134.915 19.49 A 11.661 11.661 0 0 0 130.177 22.752 A 13.302 13.302 0 0 0 126.955 29.945 A 18.039 18.039 0 0 0 126.793 32.4 A 16.504 16.504 0 0 0 127.395 36.962 A 12.936 12.936 0 0 0 130.177 42.048 A 11.827 11.827 0 0 0 138.825 46.064 A 15.898 15.898 0 0 0 139.537 46.08 Z" id="3" vectorEffect="non-scaling-stroke" />
                                <path stroke='rgb(255, 238, 0)' d="M 171.865 0 L 171.865 50.4 L 166.465 50.4 L 166.465 0 L 171.865 0 Z" id="4" vectorEffect="non-scaling-stroke" />
                                <path stroke='rgb(132, 0, 255)' d="M 186.625 0 L 186.625 50.4 L 181.225 50.4 L 181.225 0 L 186.625 0 Z" id="5" vectorEffect="non-scaling-stroke" />
                                <path stroke='rgb(170, 255, 0)' d="M 222.481 40.032 L 228.385 40.032 Q 226.513 44.928 222.445 47.952 Q 218.538 50.856 212.472 50.971 A 26.577 26.577 0 0 1 211.969 50.976 A 19.969 19.969 0 0 1 205.642 50.015 A 16.629 16.629 0 0 1 198.721 45.576 Q 193.753 40.32 193.753 32.4 A 22.02 22.02 0 0 1 194.599 26.157 A 17.395 17.395 0 0 1 198.505 19.224 Q 203.545 13.824 211.609 13.824 A 19.588 19.588 0 0 1 217.875 14.785 A 16.357 16.357 0 0 1 224.713 19.224 Q 229.465 24.408 229.465 32.4 L 229.465 34.56 L 199.297 34.56 Q 199.873 39.528 203.257 42.768 Q 206.713 46.08 212.041 46.08 A 13.58 13.58 0 0 0 216.371 45.429 Q 220.197 44.148 222.312 40.345 A 14.19 14.19 0 0 0 222.481 40.032 Z M 199.369 29.52 L 223.849 29.52 A 14.294 14.294 0 0 0 222.592 25.369 A 12.02 12.02 0 0 0 219.961 21.816 A 11.715 11.715 0 0 0 212.527 18.747 A 15.262 15.262 0 0 0 211.609 18.72 A 13.186 13.186 0 0 0 207.299 19.4 A 11.444 11.444 0 0 0 203.257 21.816 A 12.393 12.393 0 0 0 199.671 28.009 A 16.022 16.022 0 0 0 199.369 29.52 Z" id="6" vectorEffect="non-scaling-stroke" />
                                <path stroke='rgb(255, 102, 0)' d="M 244.945 50.4 L 239.545 50.4 L 239.545 19.152 L 232.201 19.152 L 232.201 14.4 L 239.545 14.4 L 239.545 1.512 L 244.945 1.512 L 244.945 14.4 L 253.225 14.4 L 253.225 19.152 L 244.945 19.152 L 244.945 50.4 Z" id="7" vectorEffect="non-scaling-stroke" />
                            </g>
                        </svg>
                        <span id='slogan'>Make Crypto Assets EASY</span>
                    </div>
                </div>

                <div className='welcome-buttons'>
                    <button onClick={_ => this.expandPage('recover')}>{i18n.welcome.import}</button>
                    <span>|</span>
                    <button onClick={_ => this.expandPage('create')}>{i18n.welcome.create}</button>
                </div>

                {
                    this.state.expandNewKey || this.state.expandRecoverKey ?
                        <div id='expanding-page'>
                            {this.state.expandRecoverKey ? <RecoverKey onCancel={() => this.closePage('recover')} onOk={() => this.onOk()} /> : undefined}
                            {this.state.expandNewKey ? <NewKey onCancel={() => this.closePage('create')} onOk={() => this.onOk()} /> : undefined}
                        </div> : undefined
                }

            </div>
        );
    }
}

export default Welcome;