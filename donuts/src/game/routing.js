import { EventBus } from './EventBus';
import { CONTENT_ROUTES } from './menuConfig';

const BLOG_URL = 'https://calm-reef-66202-3443b850ed8c.herokuapp.com/';

// Home is the default view: any hash that isn't a content route.
export const isHomeUrl = () =>
    !CONTENT_ROUTES.some((route) => window.location.hash.includes(route));

export function navigateToDestination(name) {
    if (name === 'Blog') {
        EventBus.emit('donut-clicked', true);
        window.location.href = BLOG_URL;
        return;
    }
    if (name === 'Resume') {
        EventBus.emit('donut-clicked', true);
        window.location.href = `${import.meta.env.BASE_URL}assets/resume.pdf`;
        return;
    }
    if (name === 'Home') {
        localStorage.removeItem('donutClicked');
        window.location.hash = '#/';
        return;
    }
    EventBus.emit('donut-clicked', true);
    window.location.hash = `#/${name.toLowerCase()}`;
}
