   // pages/api/proxy.ts
   import { NextResponse } from 'next/server';

   export async function GET(req: Request) {
     const token = req.headers.get('Authorization');

     try {
       const response = await fetch('https://api.intra.42.fr/v2/me', {
         method: 'GET',
         headers: {
           Authorization: token || '',
         },
       });

       if (!response.ok) {
         throw new Error('Erreur lors de l\'appel à l\'API 42');
       }

       const data = await response.json();

       const response2 = await fetch(`https://api.intra.42.fr/v2/users/${data.id}/events_users`, {
        method: 'GET',
        headers: {
          Authorization: token || '',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'appel à l\'API 42 pour les événements de l\'utilisateur');
      }

      const events = await response2.json();


      data.events = events
       return NextResponse.json(data);
     } catch (error) {
       console.error('Erreur:', error);
       return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
     }
   }

