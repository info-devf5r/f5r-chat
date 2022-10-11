import Resource from '../Resource';
import styles from '../styles/components/Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.container}>
      <img src={Resource.Gifs.LOADER} alt='loading...' />
    </div>
  );
};

export default Loader;
