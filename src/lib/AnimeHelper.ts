import anime from 'animejs';

export default class AnimeHelper {

    static expandPage(targets: string, from: number, to: number, complete?: () => void) {
        anime({
            targets,
            translateY: [from, to],
            easing: 'easeOutQuint',
            duration: 600,
            complete
        });
    }
}