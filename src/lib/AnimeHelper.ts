import anime from 'animejs';

export default class AnimeHelper {

    static expandPage(targets: string, from: number, to: number, complete?: () => void, easing = 'easeOutQuint') {
        anime({
            targets,
            translateY: [from, to],
            opacity: [to, from],
            easing,
            duration: 600,
            complete,
        });
    }
}