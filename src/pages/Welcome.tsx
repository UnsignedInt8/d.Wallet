import * as React from 'react';
import Particles from 'react-particles-js';
import '../styles/Welcome.scss';
const btc = require('../assets/bitcoin-logo.svg');

const nightSky: any = {
    "particles": {
        "number": {
            "value": 160,
            "density": {
                "enable": true,
                "value_area": 500
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

class Welcome extends React.Component {
    render() {
        return (
            <div id='welcome'>
                <Particles className='particlejs' params={nightSky} width={`100%`} height={`100%`} />

                <div id='welcome-content' className='quicksand '>
                    <div>
                        <img src={btc} />
                        Make Crypto Assets EASY
                    </div>
                </div>

                <div id='welcome-buttons'>
                    <button>Recover</button>
                    <span>|</span>
                    <button>Create</button>
                </div>
            </div>
        );
    }
}

export default Welcome;