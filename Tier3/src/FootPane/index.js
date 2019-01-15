import React from 'react';
import 'typeface-roboto';

const styles = {
    footerwrap: {
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        alignContent: 'center',
        height: '5vh',
    },
    ggfooter: {
        margin: '0 2em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    footerHeader: {
        marginTop: 0,
        fontWeight: 700,
    },
    footerUL: {
        listStyle: 'none',
        paddingLeft: '0',
    },
    footerIcon: {
        height: '30px'
    }
};

const FootPane = () => (
    <div style={styles.footerwrap}>
        <footer style={styles.ggfooter}>
            <img style={styles.footerIcon}
                 src="/img/gg-logo.png"
                 alt="Global Good"/>
            <div>&copy; 2018 globalgood All Rights Reserved.</div>
        </footer>
    </div>
)

export default FootPane;
