// Test end-to-end pour la fonctionnalité des favoris
describe('Favorites Feature Tests', () => {
  const userId = 'user123'; // Utilisateur simulé pour les tests

  beforeEach(() => {
    // Visite la page des cours
    cy.visit('/CoursesPage');
    // Attend que les cours soient chargés
    cy.get('.courseCard').should('exist');
  });

  it('should add a course to favorites', () => {
    // Sélectionne le premier cours
    cy.get('.courseCard').first().within(() => {
      // Récupère le nom du cours pour la vérification
      cy.get('h2').invoke('text').as('courseName');
      
      // Clique sur le bouton d'ajout aux favoris
      cy.get('.favorite-button').click();
      
      // Vérifie que le bouton est passé en mode "favori"
      cy.get('.favorite-button').should('have.class', 'favorite-active');
    });

    // Navigue vers la page des favoris
    cy.visit('/favorites');
    
    // Vérifie que le cours ajouté apparaît dans la liste des favoris
    cy.get('@courseName').then((courseName) => {
      cy.get('.favorites-grid').should('contain', courseName);
    });
  });

  it('should remove a course from favorites', () => {
    // D'abord, ajoutons un cours aux favoris
    cy.get('.courseCard').first().within(() => {
      cy.get('h2').invoke('text').as('courseName');
      cy.get('.favorite-button').click();
    });
    
    // Puis naviguons vers la page des favoris
    cy.visit('/favorites');
    
    // Vérifions que le cours est bien dans les favoris
    cy.get('.favorite-card').should('exist');
    
    // Supprimons le cours des favoris
    cy.get('.favorite-button').click();
    
    // Vérifions que le cours a été supprimé de la liste
    cy.get('.favorite-card').should('not.exist');
    // Ou si la page est vide, vérifions le message
    cy.get('.empty-favorites').should('exist');
  });

  it('should handle multiple favorites correctly', () => {
    // Ajoute plusieurs cours aux favoris
    cy.get('.courseCard').eq(0).within(() => {
      cy.get('.favorite-button').click();
    });
    
    cy.get('.courseCard').eq(1).within(() => {
      cy.get('.favorite-button').click();
    });
    
    // Vérifie la page des favoris
    cy.visit('/favorites');
    cy.get('.favorite-card').should('have.length', 2);
  });
});