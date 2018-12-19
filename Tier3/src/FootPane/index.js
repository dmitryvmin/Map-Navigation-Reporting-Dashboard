import React from 'react';
import 'typeface-roboto';

const styles = {
    footerwrap: {
        width: '100%',
        backgroundColor: 'white',
        bottom: 0,
        left: 0,
        padding: '2em 0',
    },
    ggfooter: {
        width: '80vw',
        margin: '0 auto',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footerHeader: {
        marginTop: 0,
        fontWeight: 700,
    },
    footerUL: {
        listStyle: 'none',
        paddingLeft: '0',
    },
};

const FootPane = () => (
    <div style={styles.footerwrap}>
        <footer style={styles.ggfooter}>
            <div><img src="/img/gg-logo.png" alt="Global Good"/></div>
            <div>&copy; 2018 globalgood All Rights Reserved.</div>
        </footer>
    </div>
)

export default FootPane;
