// Envia 5 produtos aleatórios (com link de afiliado) como mensagem no Grupo
// "Achadinhos e Promoções" do Rod Shop. Roda via GitHub Actions, de hora em
// hora, sem depender do site estar aberto em lugar nenhum.
import admin from 'firebase-admin';

const APP_ID = 'rodshop-v1';
const HOW_MANY = 5;

function initFirebase() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error('Faltou configurar o secret FIREBASE_SERVICE_ACCOUNT_KEY no repositório do GitHub.');
  }
  const serviceAccount = JSON.parse(raw);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  return admin.firestore();
}

function pickRandom(list, n) {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, list.length));
}

async function main() {
  const db = initFirebase();

  const productsRef = db
    .collection('artifacts').doc(APP_ID)
    .collection('public').doc('data')
    .collection('products');

  const snapshot = await productsRef.get();
  const products = [];
  snapshot.forEach((docSnap) => products.push({ id: docSnap.id, ...docSnap.data() }));

  if (products.length === 0) {
    console.log('Nenhum produto cadastrado ainda — nada para enviar desta vez.');
    return;
  }

  const picked = pickRandom(products, HOW_MANY);
  const lines = picked
    .map((p, i) => `${i + 1}. ${p.name}\n${p.link}`)
    .join('\n\n');

  const text = `🔥 Achadinhos selecionados pra você!\n\n${lines}`;

  const groupRef = db
    .collection('artifacts').doc(APP_ID)
    .collection('public').doc('data')
    .collection('group-messages');

  await groupRef.add({
    sender: 'admin',
    senderId: 'admin',
    senderName: 'Rod Shop',
    text,
    createdAt: new Date().toISOString()
  });

  console.log(`Enviados ${picked.length} produto(s) ao grupo:`, picked.map((p) => p.name).join(', '));
}

main().catch((err) => {
  console.error('Falha ao enviar produtos ao grupo:', err);
  process.exit(1);
});
